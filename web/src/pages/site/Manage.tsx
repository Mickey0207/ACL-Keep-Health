import { Card, Form, Input, Button, Space, Typography, Alert } from 'antd'

export default function Manage() {
  const [form] = Form.useForm()

  const onFinish = (v: any) => {
    console.log('save site info', v)
  }

  const onReset = () => {
    form.resetFields()
  }

  return (
    <Card
      style={{
        background: '#ffffff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}
    >
      <Typography.Title level={5} style={{ marginBottom: 16 }}>
        案場管理
      </Typography.Title>

      <Alert
        type="info"
        message="編輯案場基本資訊"
        description="變更案場資訊後會自動儲存"
        style={{ marginBottom: 20 }}
        showIcon
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: '中山大樓',
          address: '台北市中山區 xxx 路 1 號',
          unit: 'ACL 檢查公司'
        }}
        requiredMark="optional"
      >
        <Form.Item
          label="案場名稱"
          name="name"
          rules={[{ required: true, message: '請輸入案場名稱' }]}
        >
          <Input placeholder="例如：中山大樓" size="large" />
        </Form.Item>

        <Form.Item
          label="地址"
          name="address"
          rules={[{ required: true, message: '請輸入案場地址' }]}
        >
          <Input placeholder="詳細地址" size="large" />
        </Form.Item>

        <Form.Item label="檢查單位" name="unit">
          <Input placeholder="例如：ACL 檢查公司" size="large" />
        </Form.Item>

        <Space style={{ marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ minWidth: 100 }}
          >
            儲存
          </Button>
          <Button size="large" onClick={onReset}>
            重置
          </Button>
        </Space>
      </Form>
    </Card>
  )
}
