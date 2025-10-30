import { useNavigate, useLocation } from 'react-router-dom'
import { Card, Typography, Button, Space, Flex, Layout, Form, Input, Divider, Alert, message } from 'antd'
import { ArrowLeftOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons'
import { useEffect } from 'react'

export default function AccountPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()

  useEffect(() => {
    // 檢查 URL 是否有 line_linked=true 參數
    const params = new URLSearchParams(location.search)
    if (params.get('line_linked') === 'true') {
      message.success('LINE 帳號綁定成功！')
      // 移除 URL 參數，避免重新整理時再次顯示訊息
      navigate('/account', { replace: true })
    }
  }, [navigate, location])

  const handleBindLine = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      message.error('請先登入後再進行操作')
      navigate('/login')
      return
    }

    try {
      const response = await fetch('https://server.mickeylin0207.workers.dev/api/auth/line/redirect', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.redirectUrl) {
          // 導向到 LINE 授權頁面
          window.location.href = data.redirectUrl;
        } else {
          message.error('無法取得 LINE 授權網址，請稍後再試。');
        }
      } else {
        const errorData = await response.json();
        message.error(`驗證失敗：${errorData.error || '請重新登入'}`);
        if (response.status === 401) {
          handleLogout(); // 如果是授權問題，直接登出
        }
      }
    } catch (error) {
      message.error('綁定過程中發生網路錯誤，請檢查您的連線。');
      console.error('Error during LINE bind redirect:', error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('username')
    message.success('您已成功登出')
    navigate('/login')
  }

  return (
    <Layout style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Layout.Header
        style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
          padding: '16px 24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Flex align="center" justify="space-between">
          <Typography.Title
            level={3}
            style={{ margin: 0, color: '#ffffff' }}
          >
            帳戶設定
          </Typography.Title>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/sites')}
            style={{ color: '#ffffff' }}
          >
            返回
          </Button>
        </Flex>
      </Layout.Header>

      <Layout.Content style={{ flex: 1, padding: '24px 16px', background: '#f5f5f5', paddingBottom: 88 }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Card style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
            {/* 基本資訊 */}
            <Typography.Title level={5}>基本資訊</Typography.Title>
            <Form layout="vertical" form={form} size="large">
              <Form.Item label="使用者名稱" name="username" initialValue="demo user">
                <Input placeholder="請輸入使用者名稱" />
              </Form.Item>
              <Form.Item label="電子郵件" name="email" initialValue="demo@example.com">
                <Input placeholder="請輸入電子郵件" type="email" disabled />
              </Form.Item>
            </Form>

            <Space style={{ marginBottom: 16 }}>
              <Button type="primary">保存</Button>
              <Button>取消</Button>
            </Space>

            <Divider />

            {/* 密碼管理 */}
            <Typography.Title level={5}>變更密碼</Typography.Title>
            <Form layout="vertical" size="large">
              <Form.Item label="目前密碼" name="currentPassword">
                <Input placeholder="請輸入目前密碼" type="password" />
              </Form.Item>
              <Form.Item label="新密碼" name="newPassword">
                <Input placeholder="請輸入新密碼" type="password" />
              </Form.Item>
              <Form.Item label="確認新密碼" name="confirmPassword">
                <Input placeholder="請再次輸入新密碼" type="password" />
              </Form.Item>
            </Form>

            <Space style={{ marginBottom: 16 }}>
              <Button type="primary">更新密碼</Button>
              <Button>取消</Button>
            </Space>

            <Divider />

            {/* LINE 綁定 */}
            <Typography.Title level={5}>LINE 綁定</Typography.Title>
            <Alert
              message="將您的帳戶與 LINE 連接，以便接收通知或快速登入。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Button
              type="primary"
              style={{ background: '#00B900', borderColor: '#00B900' }}
              onClick={handleBindLine}
            >
              綁定 LINE 帳號
            </Button>

            <Divider />

            <Button type="primary" danger block onClick={handleLogout}>
              登出
            </Button>
          </Card>
        </div>
      </Layout.Content>

      <Layout.Footer
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#ffffff',
          borderTop: '1px solid #f0f0f0',
          padding: '0',
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'stretch'
        }}
      >
        <button
          onClick={() => navigate('/sites')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            textDecoration: 'none',
            color: '#999999',
            borderBottom: 'none',
            transition: 'all 0.3s ease',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'inherit',
            fontFamily: 'inherit'
          }}
          title="案場列表"
        >
          <UnorderedListOutlined style={{ fontSize: 20, marginBottom: 4 }} />
          <span style={{ fontSize: 11 }}>案場列表</span>
        </button>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            textDecoration: 'none',
            color: '#0ea5e9',
            borderBottom: '3px solid #0ea5e9',
            transition: 'all 0.3s ease'
          }}
          title="帳戶設定"
        >
          <UserOutlined style={{ fontSize: 20, marginBottom: 4 }} />
          <span style={{ fontSize: 11 }}>帳戶設定</span>
        </div>
      </Layout.Footer>
    </Layout>
  )
}
