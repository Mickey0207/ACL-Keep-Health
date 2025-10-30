import { Card, Typography, Form, Input, Button, Space } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const onFinish = () => {
    navigate('/sites')
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
        padding: 16
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          background: '#ffffff',
          borderRadius: 12
        }}
      >
        <Typography.Title
          level={2}
          style={{ textAlign: 'center', marginBottom: 8, color: '#0ea5e9' }}
        >
          ACL Keep Health
        </Typography.Title>
        <Typography.Paragraph
          style={{
            textAlign: 'center',
            marginBottom: 24,
            color: '#999999',
            fontSize: 14
          }}
        >
          案場保養與照片輸出系統
        </Typography.Paragraph>

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label="電子郵件"
            name="email"
            rules={[
              { required: true, message: '請輸入電子郵件' },
              { type: 'email', message: '請輸入有效的電子郵件' }
            ]}
          >
            <Input
              placeholder="example@company.com"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            label="密碼"
            name="password"
            rules={[{ required: true, message: '請輸入密碼' }]}
          >
            <Input.Password
              placeholder="••••••••"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            style={{ marginTop: 8, fontWeight: 600 }}
          >
            登入
          </Button>
        </Form>

        <Typography.Paragraph
          style={{
            textAlign: 'center',
            marginTop: 16,
            fontSize: 12,
            color: '#999999'
          }}
        >
          演示帳戶：任意填寫並送出
        </Typography.Paragraph>
      </Card>
    </div>
  )
}
