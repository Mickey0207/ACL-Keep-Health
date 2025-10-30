import { Card, Typography, Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://server.mickeylin0207.workers.dev/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        }
      );

      const result = await response.json();

      if (response.ok) {
        message.success('登入成功！');
        // 儲存使用者資訊和 token
        localStorage.setItem('accessToken', result.session.access_token);
        localStorage.setItem('username', result.user.user_metadata.full_name || result.user.email);
        navigate('/sites');
      } else {
        message.error(result.error || '登入失敗，請檢查您的帳號密碼。');
      }
    } catch (error) {
      message.error('網路連線錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
        padding: 16,
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          background: '#ffffff',
          borderRadius: 12,
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
            fontSize: 14,
          }}
        >
          案場保養與照片輸出系統
        </Typography.Paragraph>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            label="電子郵件"
            name="email"
            rules={[
              { required: true, message: '請輸入電子郵件' },
              { type: 'email', message: '請輸入有效的電子郵件' },
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
            loading={loading}
          >
            登入
          </Button>
        </Form>
      </Card>
    </div>
  );
}

