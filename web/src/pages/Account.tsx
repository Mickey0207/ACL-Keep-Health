import { useNavigate } from 'react-router-dom'
import { Card, Typography, Button, Space, Flex, Layout, Form, Input, Divider, Alert } from 'antd'
import { ArrowLeftOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons'

export default function AccountPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

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
              <Form.Item label="姓名" name="name" initialValue="demo user">
                <Input placeholder="請輸入姓名" />
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

            {/* LINE 帳號綁定 */}
            <Typography.Title level={5}>LINE 帳號綁定</Typography.Title>
            <Alert
              message="綁定 LINE 帳號後，您可以透過 LINE 快速登入"
              type="info"
              style={{ marginBottom: 16 }}
            />
            <Button
              onClick={() => {
                alert('將開啟 LINE 授權頁面 (後端 API)')
              }}
              style={{ marginBottom: 16 }}
            >
              綁定 LINE 帳號
            </Button>

            <Divider />

            {/* 登出 */}
            <Typography.Title level={5}>登出</Typography.Title>
            <Button
              danger
              onClick={() => {
                navigate('/login')
              }}
            >
              登出帳戶
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
