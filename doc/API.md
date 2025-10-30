# API 說明

Base URL: https://server.mickeylin0207.workers.dev

所有受保護路由皆需在 Header 夾帶 Authorization: Bearer <Supabase Access Token>

## Auth

- POST /api/auth/login
	- Body: { email: string, password: string }
	- 回傳: { access_token, user }

- GET /api/auth/me
	- 需求: Authorization Bearer token
	- 用途: 取得目前登入使用者的合併資料（email、username、line_user_id、line_display_name）
	- 回傳: { id, email, username, line_user_id?, line_display_name? }

- POST /api/auth/reset-password
	- 需求: Authorization Bearer token
	- 用途: 寄送重設密碼信到使用者的 email（由 Supabase 寄送）
	- 回傳: { ok: true }

- GET /api/auth/line/redirect
	- 需求: Authorization Bearer token
	- 用途: 取得 LINE OAuth 授權網址（前端自行導向）
	- 回傳: { redirectUrl: string }

- GET /api/auth/line/callback
	- 用途: LINE 授權回呼，由後端驗證並更新資料庫，完成後 302 導回前端 /account?line_linked=true

- POST /api/auth/line/unlink
	- 需求: Authorization Bearer token
	- 用途: 取消使用者的 LINE 綁定（清空 line_user_id 與 line_display_name）
	- 回傳: { ok: true }

