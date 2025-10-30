import { Form, Input, DatePicker, Upload, Button, Card, Space, Typography } from 'antd'
import dayjs from 'dayjs'

export default function StartForm() {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log('submit maintenance:', values)
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
      <Typography.Title level={5} style={{ marginBottom: 20 }}>
        保養開始表單
      </Typography.Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ date: dayjs() }}
        requiredMark="optional"
      >
        <Form.Item
          label="樓層"
          name="floor"
          rules={[{ required: true, message: '請輸入樓層' }]}
        >
          <Input placeholder="例如：B1 / 2F" size="large" />
        </Form.Item>

        <Form.Item
          label="維運系統"
          name="system"
          rules={[{ required: true, message: '請選擇維運系統' }]}
        >
          <Input placeholder="例如：消防 / 空調" size="large" />
        </Form.Item>

        <Form.Item
          label="保養內容"
          name="content"
          rules={[{ required: true, message: '請輸入保養內容' }]}
        >
          <Input.TextArea
            placeholder="詳細描述保養項目"
            rows={3}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item label="保養備註" name="note">
          <Input.TextArea
            placeholder="其他說明（可選）"
            rows={2}
            showCount
            maxLength={300}
          />
        </Form.Item>

        <Form.Item
          label="保養日期"
          name="date"
          rules={[{ required: true, message: '請選擇保養日期' }]}
        >
          <DatePicker style={{ width: '100%' }} size="large" />
        </Form.Item>

        <Form.Item
          label="保養人員"
          name="staff"
          rules={[{ required: true, message: '請輸入保養人員名稱' }]}
        >
          <Input placeholder="例如：王小明" size="large" />
        </Form.Item>

        <Form.Item label="上傳照片" name="photos">
          <Upload
            beforeUpload={() => false}
            listType="picture-card"
            multiple
            maxCount={10}
          >
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: 12, color: '#666' }}>選擇照片</div>
            </div>
          </Upload>
        </Form.Item>

        <Space style={{ marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ minWidth: 100 }}
          >
            送出
          </Button>
          <Button size="large" onClick={onReset}>
            清除
          </Button>
        </Space>
      </Form>
    </Card>
  )
}
