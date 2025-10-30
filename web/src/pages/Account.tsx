import { useNavigate, useLocation } from 'react-router-dom'
import { Card, Typography, Button, Space, Flex, Layout, Form, Input, Divider, Alert, message, Row, Col } from 'antd'
import { ArrowLeftOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

export default function AccountPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    // 檢查 URL 是否有 line_linked=true 參數
    const params = new URLSearchParams(location.search)
    if (params.get('line_linked') === 'true') {
      message.success('LINE 帳號綁定成功！')
      // 移除 URL 參數，避免重新整理時再次顯示訊息
      navigate('/account', { replace: true })
    }
    // 載入使用者資料
    loadProfile()
  }, [navigate, location])

  const getToken = () => localStorage.getItem('accessToken')

  const loadProfile = async () => {
    const token = getToken()
    if (!token) {
      navigate('/login')
      return
    }
    try {
      setLoading(true)
      
      // 先嘗試取得個人資料
      const res = await fetch('https://server.mickeylin0207.workers.dev/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        throw new Error('Failed to load profile')
      }
      const data = await res.json()
      
      // 如果 username 是 null，先初始化 profile
      if (!data.username && !data.line_user_id) {
        console.log('Profile incomplete, initializing...')
        const initRes = await fetch('https://server.mickeylin0207.workers.dev/api/auth/init-profile', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
        if (initRes.ok) {
          const initData = await initRes.json()
          console.log('Profile initialized:', initData)
          // 重新載入 profile
          const reloadRes = await fetch('https://server.mickeylin0207.workers.dev/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (reloadRes.ok) {
            const reloadedData = await reloadRes.json()
            setProfile(reloadedData)
            const displayName = reloadedData.line_display_name || reloadedData.username || ''
            form.setFieldsValue({
              username: displayName,
              email: reloadedData.email || '',
            })
            return
          }
        }
      }
      
      setProfile(data)
      // 顯示名稱優先順序：LINE 顯示名稱 > users.username
      const displayName = data.line_display_name || data.username || ''
      form.setFieldsValue({
        username: displayName,
        email: data.email || '',
      })
    } catch (e) {
      message.error('無法載入帳戶資料，請重新登入')
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

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

  const handleSendResetEmail = async () => {
    const token = getToken()
    if (!token) return navigate('/login')
    try {
      const res = await fetch('https://server.mickeylin0207.workers.dev/api/auth/reset-password', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('fail')
      message.success('已寄送重設密碼信到您的信箱')
    } catch {
      message.error('寄送重設密碼信失敗，請稍後再試')
    }
  }

  const handleUnlinkLine = async () => {
    const token = getToken()
    if (!token) return navigate('/login')
    try {
      const res = await fetch('https://server.mickeylin0207.workers.dev/api/auth/line/unlink', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('fail')
      message.success('已取消 LINE 綁定')
      await loadProfile()
    } catch {
      message.error('取消綁定失敗，請稍後再試')
    }
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
              <Form.Item label="使用者名稱" name="username">
                <Input placeholder="請輸入使用者名稱" />
              </Form.Item>
              <Form.Item label="電子郵件" name="email">
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
            <Alert
              message="系統將寄送重設密碼連結至您的電子郵件。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Space style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={handleSendResetEmail}>寄送重設密碼信</Button>
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
            {profile?.line_user_id ? (
              <Row gutter={12} align="middle">
                <Col flex="0 0 auto">
                  <Button danger onClick={handleUnlinkLine}>取消綁定</Button>
                </Col>
                <Col flex="auto">
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form layout="vertical">
                        <Form.Item label="LINE 名稱">
                          <Input value={profile?.line_display_name || ''} readOnly />
                        </Form.Item>
                      </Form>
                    </Col>
                    <Col span={12}>
                      <Form layout="vertical">
                        <Form.Item label="LINE UUID">
                          <Input value={profile?.line_user_id || ''} readOnly />
                        </Form.Item>
                      </Form>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ) : (
              <Button
                type="primary"
                style={{ background: '#00B900', borderColor: '#00B900' }}
                onClick={handleBindLine}
              >
                綁定 LINE 帳號
              </Button>
            )}

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
