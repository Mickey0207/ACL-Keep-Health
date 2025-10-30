import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createClient, User } from '@supabase/supabase-js';

// 綁定環境變數類型
type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  LINE_CHANNEL_ID: string;
  LINE_CHANNEL_SECRET: string;
  SUPABASE_SERVICE_ROLE_KEY?: string; // 用於後端繞過 RLS 的服務金鑰（必須設定於 Secrets）
  FRONTEND_BASE_URL?: string; // 例如 https://acl-keep-health.pages.dev 或自訂網域
  LINE_CALLBACK_URL?: string; // 例如 https://server.mickeylin0207.workers.dev/api/auth/line/callback
};

// 擴展 Hono 的 Context 類型以包含使用者資訊
type AppContext = {
  Bindings: Bindings;
  Variables: {
    user: User;
    supabaseToken: string;
  };
};

const app = new Hono<AppContext>();

// 設定 CORS
app.use('/api/*', cors());

// --- 身份驗證路由 ---
const authRoutes = new Hono<AppContext>();

// 一般登入
authRoutes.post('/login', async (c) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return c.json({ error: error.message }, 401);
  }

  return c.json({
    message: 'Login successful',
    user: data.user,
    session: data.session,
  });
});

// --- LINE 綁定路由 ---

// 驗證 Supabase JWT 的中介軟體
const verifySupabaseJWT = async (c: any, next: () => Promise<void>) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid authorization header' }, 401);
  }
  const token = authHeader.substring(7);

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return c.json({ error: 'Invalid token' }, 401);
  }
  
  // 將使用者資訊存入 context
  c.set('user', user);
  c.set('supabaseToken', token);
  await next();
};


// 1. 產生 LINE 授權 URL (需要 JWT 驗證)
authRoutes.get('/line/redirect', verifySupabaseJWT, (c) => {
  const user = c.get('user');
  const state = Math.random().toString(36).substring(7);
  
  // 使用 state 來傳遞 user.id，這是一個簡化做法。
  // 在生產環境中，建議使用更安全的方法，例如將 state 和 user.id 存入 KV 中進行驗證。
  const statePayload = `${state}:${user.id}`;

  const reqUrl = new URL(c.req.url);
  const callbackUrl = c.env.LINE_CALLBACK_URL ?? `${reqUrl.protocol}//${reqUrl.host}/api/auth/line/callback`;

  const lineAuthUrl = new URL('https://access.line.me/oauth2/v2.1/authorize');
  lineAuthUrl.searchParams.append('response_type', 'code');
  lineAuthUrl.searchParams.append('client_id', c.env.LINE_CHANNEL_ID);
  lineAuthUrl.searchParams.append('redirect_uri', callbackUrl);
  lineAuthUrl.searchParams.append('state', statePayload);
  lineAuthUrl.searchParams.append('scope', 'profile openid email');

  // 回傳 JSON 而不是直接重新導向，讓前端處理導向
  return c.json({
    success: true,
    redirectUrl: lineAuthUrl.toString()
  });
});

// 2. 從 LINE 接收回呼並處理
authRoutes.get('/line/callback', async (c) => {
  const code = c.req.query('code');
  const statePayload = c.req.query('state');

  if (!code || !statePayload) {
    return c.json({ error: 'Authorization code or state is missing' }, 400);
  }

  // 從 state 中解析出 supabase user id
  const [state, supabaseUserId] = statePayload.split(':');
  if (!supabaseUserId) {
      return c.json({ error: 'Invalid state payload' }, 400);
  }
  // TODO: 可以在此處驗證 state 的唯一性


  // 3. 用 code 換取 access token
  const reqUrl = new URL(c.req.url);
  const callbackUrl = c.env.LINE_CALLBACK_URL ?? `${reqUrl.protocol}//${reqUrl.host}/api/auth/line/callback`;

  const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: callbackUrl,
      client_id: c.env.LINE_CHANNEL_ID,
      client_secret: c.env.LINE_CHANNEL_SECRET,
    }),
  });

  const tokenData = await tokenResponse.json<{ access_token: string, id_token: string }>();
  if (!tokenResponse.ok) {
    return c.json({ error: 'Failed to get access token from LINE', details: tokenData }, 500);
  }

  // 4. 用 id_token 驗證並取得使用者資料
  const profileResponse = await fetch('https://api.line.me/oauth2/v2.1/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
          id_token: tokenData.id_token,
          client_id: c.env.LINE_CHANNEL_ID
      })
  });

  const profileData = await profileResponse.json<{ sub: string, name: string, picture: string, email: string }>();
  if (!profileResponse.ok) {
      return c.json({ error: 'Failed to verify ID token', details: profileData }, 500);
  }

  // 5. 在 Supabase 中更新使用者資料
  // 使用 Service Role Key 來更新資料，因為 RLS 會限制匿名金鑰的寫入權限
  if (!c.env.SUPABASE_SERVICE_ROLE_KEY) {
    return c.json({
      error: 'Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY not set',
      hint: '請在 Cloudflare Workers 中設定 SUPABASE_SERVICE_ROLE_KEY 秘密值，才能在回呼中更新使用者資料。'
    }, 500);
  }

  const supabaseAdmin = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  
  // 5.1 檢查此 LINE 是否已綁定其他帳戶
  const { data: lineOwnerRows, error: lineOwnerError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('line_user_id', profileData.sub)
    .limit(1);

  if (lineOwnerError) {
    return c.json({ error: 'Failed to check existing LINE binding', details: lineOwnerError }, 500);
  }
  if (lineOwnerRows && lineOwnerRows.length > 0 && lineOwnerRows[0].id !== supabaseUserId) {
    return c.json({ error: '此 LINE 帳號已綁定到其他使用者' }, 409);
  }

  // 5.2 嘗試更新既有資料列
  const { data: updatedRows, error: updateError } = await supabaseAdmin
    .from('users')
    .update({
      line_user_id: profileData.sub,
      line_display_name: profileData.name,
    })
    .eq('id', supabaseUserId)
    .select();

  if (updateError) {
    return c.json({ error: 'Failed to update user profile in Supabase', details: updateError }, 500);
  }

  // 5.3 若沒有任何列被更新（代表 users 表尚未有此使用者），則插入一筆
  if (!updatedRows || updatedRows.length === 0) {
    // 取回 auth 使用者資料（以便填入 email/username 等必要欄位）
    let userEmail: string | null = null;
    let userName: string | null = null;
    try {
      // 注意：此 API 需要 Service Role Key
      const { data: adminUser, error: adminErr } = await (supabaseAdmin as any).auth.admin.getUserById(supabaseUserId);
      if (adminErr) {
        // 若拿不到也不要中斷，盡力插入最小欄位
        console.warn('getUserById failed:', adminErr);
      } else if (adminUser?.user) {
        userEmail = adminUser.user.email ?? null;
        userName = (adminUser.user.user_metadata?.full_name as string | undefined) ?? (userEmail ? userEmail.split('@')[0] : null);
      }
    } catch (e) {
      console.warn('auth.admin.getUserById exception:', e);
    }

    const insertPayload: Record<string, any> = {
      id: supabaseUserId,
      line_user_id: profileData.sub,
      line_display_name: profileData.name,
    };
    if (userEmail) insertPayload.email = userEmail;
    if (userName) insertPayload.username = userName;

    const { error: insertError } = await supabaseAdmin
      .from('users')
      .insert(insertPayload);

    if (insertError) {
      return c.json({ error: 'Failed to insert user profile in Supabase', details: insertError }, 500);
    }
  }

  // 6. 成功後導向回前端的帳戶頁面
  const frontendBase = c.env.FRONTEND_BASE_URL ?? 'https://acl-keep-health.pages.dev';
  return c.redirect(`${frontendBase}/account?line_linked=true`);
});

// 3. 取得目前使用者資料（合併 auth 與 public.users）
authRoutes.get('/me', verifySupabaseJWT, async (c) => {
  const user = c.get('user');
  const token = c.get('supabaseToken');
  
  // 使用 anon key + 使用者 JWT 以通過 RLS（auth.uid() = id）
  let supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  let { data, error } = await supabase
    .from('users')
    .select('id, username, email, line_user_id, line_display_name')
    .eq('id', user.id)
    .maybeSingle();

  // 若無資料（可能被 RLS 過濾或尚未建立），且有 service role，則用 service role 重查一次
  if ((!data || error) && c.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (error) console.log('RLS/anon query error, retrying with service role', error);
    supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
    const result = await supabase
      .from('users')
      .select('id, username, email, line_user_id, line_display_name')
      .eq('id', user.id)
      .maybeSingle();
    data = result.data;
    error = result.error;
  }

  if (error) {
    console.error('Failed to load user profile:', error);
    return c.json({ error: 'Failed to load profile', details: error }, 500);
  }

  return c.json({
    id: user.id,
    email: data?.email ?? user.email,
    username: data?.username ?? user.user_metadata?.full_name ?? null,
    line_user_id: data?.line_user_id ?? null,
    line_display_name: data?.line_display_name ?? null,
  });
});

// 4. 寄送重設密碼信
authRoutes.post('/reset-password', verifySupabaseJWT, async (c) => {
  const user = c.get('user');
  const frontendBase = c.env.FRONTEND_BASE_URL ?? 'https://acl-keep-health.pages.dev';

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const { data, error } = await supabase.auth.resetPasswordForEmail(user.email!, {
    redirectTo: `${frontendBase}/account`,
  });

  if (error) {
    return c.json({ error: 'Failed to send reset email', details: error }, 500);
  }
  return c.json({ success: true });
});

// 5. 取消綁定 LINE
authRoutes.post('/line/unlink', verifySupabaseJWT, async (c) => {
  const user = c.get('user');

  const key = c.env.SUPABASE_SERVICE_ROLE_KEY ?? c.env.SUPABASE_ANON_KEY;
  const supabase = createClient(c.env.SUPABASE_URL, key!);

  const { error } = await supabase
    .from('users')
    .update({ line_user_id: null, line_display_name: null })
    .eq('id', user.id);

  if (error) {
    return c.json({ error: 'Failed to unlink LINE', details: error }, 500);
  }
  return c.json({ success: true });
});

// 6. Debug: 檢查並初始化使用者在 public.users 的資料列
authRoutes.post('/init-profile', verifySupabaseJWT, async (c) => {
  const user = c.get('user');
  
  if (!c.env.SUPABASE_SERVICE_ROLE_KEY) {
    return c.json({ error: 'Service role key not configured' }, 500);
  }

  const supabaseAdmin = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  // 檢查是否已有資料列
  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (existing) {
    return c.json({ message: 'Profile already exists', data: existing });
  }

  // 建立新資料列
  const username = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const { data: inserted, error } = await supabaseAdmin
    .from('users')
    .insert({
      id: user.id,
      email: user.email,
      username: username,
    })
    .select()
    .single();

  if (error) {
    return c.json({ error: 'Failed to create profile', details: error }, 500);
  }

  return c.json({ message: 'Profile created successfully', data: inserted });
});


// 將所有身份驗證相關的路由掛載到 /api/auth
app.route('/api/auth', authRoutes);


// --- 根路由和測試路由 ---
app.get('/', (c) => {
  return c.text('Welcome to ACL Keep Health API');
});

app.get('/api', (c) => {
  return c.json({
    message: 'Welcome to ACL Keep Health API',
    version: '1.0.0',
  });
});

export default app;

