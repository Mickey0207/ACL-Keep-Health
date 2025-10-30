import { Form, Input, DatePicker, Upload, Button, Card, Space, Typography } from 'antd'
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

        <Form.Item label="保養日期" name="date" initialValue={dayjs()} rules={[{ required: true, message: '請選擇保養日期' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="保養人員" name="staff" rules={[{ required: true, message: '請輸入保養人員' }]}>
          <Input placeholder="例如：王小明" />
        </Form.Item>

        <Form.Item label="上傳照片 (optional)" name="photos">
          <Upload
            multiple
            maxCount={10}
            listType="picture-card"
            beforeUpload={() => false}
          >
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              + 選擇照片
            </div>
          </Upload>
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
