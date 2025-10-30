import React from 'react';
import { Button, Card, Form, Input, Typography } from 'antd';

const User: React.FC = () => {
  const onFinish = (v: { name: string; email: string; password?: string; lineId?: string }) => {
    // TODO: wire to backend later
    console.log('user save', v);
  };
  return (
    <div style={{ padding: 12, paddingBottom: 80, maxWidth: 720, margin: '0 auto' }}>
      <Typography.Title level={4}>用戶管理</Typography.Title>
      <Card>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
            <Input placeholder="輸入姓名" />
          </Form.Item>
          <Form.Item label="電子郵件" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item label="密碼" name="password">
            <Input.Password placeholder="如需變更可填寫" />
          </Form.Item>
          <Form.Item label="LINE 綁定代碼" name="lineId">
            <Input placeholder="未來由後端產生綁定流程" />
          </Form.Item>
          <Button type="primary" htmlType="submit">儲存</Button>
        </Form>
      </Card>
    </div>
  );
};

export default User;
