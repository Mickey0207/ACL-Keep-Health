import { Form, Input, DatePicker, Button, Card, Space } from 'antd'
import dayjs from 'dayjs'

export default function CreateItem() {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log('create new item:', values)
  }

  return (
    <Card
      title="新增項目"
      style={{
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
      }}
    >
      <Form layout="vertical" form={form} onFinish={onFinish} size="large">
        <Form.Item label="樓層" name="floor" rules={[{ required: true, message: '請輸入樓層' }]}>
          <Input placeholder="例如：B1 / 2F" />
        </Form.Item>

        <Form.Item label="保養位置" name="location" rules={[{ required: true, message: '請輸入保養位置' }]}>
          <Input placeholder="例如：大廳 / 辦公室" />
        </Form.Item>

        <Form.Item label="維運系統" name="system" rules={[{ required: true, message: '請選擇維運系統' }]}>
          <Input placeholder="例如：消防 / 空調" />
        </Form.Item>

        <Form.Item label="保養內容" name="content" rules={[{ required: true, message: '請輸入保養內容' }]}>
          <Input.TextArea
            placeholder="詳細描述保養項目"
            maxLength={500}
            showCount
            style={{ borderRadius: 6, minHeight: 120 }}
          />
        </Form.Item>

        <Form.Item label="保養備註 (optional)" name="note">
          <Input.TextArea
            placeholder="其他說明（可選）"
            maxLength={300}
            showCount
            style={{ borderRadius: 6, minHeight: 100 }}
          />
        </Form.Item>

        <Form.Item label="新增日期" name="date" initialValue={dayjs()} rules={[{ required: true, message: '請選擇新增日期' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="新增人員" name="staff" rules={[{ required: true, message: '請輸入新增人員' }]}>
          <Input placeholder="例如：王小明" />
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit">
            新增項目
          </Button>
          <Button onClick={() => form.resetFields()}>
            重置
          </Button>
        </Space>
      </Form>
    </Card>
  )
}
