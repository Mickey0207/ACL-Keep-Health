import { Hono } from 'hono';
import { cors } from 'hono/cors';

// 綁定環境變數類型
type Bindings = {
  // 未來可以在這裡添加其他環境變數
};

const app = new Hono<{ Bindings: Bindings }>();

// 設定 CORS
app.use('/api/*', cors());

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

