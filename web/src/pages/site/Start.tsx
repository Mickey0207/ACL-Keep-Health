import React, { useState } from 'react';
import { Button, Card, DatePicker, Form, Input, Select, Upload, Typography, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useAppStore, type RecordItem } from '../../store/app';

const systems = ['電力', '空調', '消防', '弱電'];

const Start: React.FC = () => {
  const { id: siteId } = useParams();
  const addRecord = useAppStore((s) => s.addRecord);
  const [form] = Form.useForm();
  const [files, setFiles] = useState<any[]>([]);

  const onFinish = (v: any) => {
    const record: RecordItem = {
      id: `${Date.now()}`,
      siteId: siteId!,
      floor: v.floor,
      system: v.system,
      content: v.content,
      note: v.note,
      date: v.date?.toISOString?.() ?? new Date().toISOString(),
      staff: v.staff,
      photos: files.map((f, idx) => ({
        id: `${Date.now()}-${idx}`,
        name: f.name,
        file: f.originFileObj,
        system: v.system,
        content: v.content,
        note: v.note,
        staff: v.staff
      }))
    };
    addRecord(record);
    form.resetFields();
    setFiles([]);
  };

  return (
    <div style={{ padding: 12, paddingBottom: 80, maxWidth: 720, margin: '0 auto' }}>
      <Typography.Title level={4}>保養開始</Typography.Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="樓層" name="floor" rules={[{ required: true }] }>
            <Input placeholder="例如：B1、1F、2F" />
          </Form.Item>
          <Form.Item label="維運系統" name="system" rules={[{ required: true }] }>
            <Select options={systems.map((s) => ({ label: s, value: s }))} placeholder="選擇系統" />
          </Form.Item>
          <Form.Item label="保養內容" name="content" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="輸入保養內容" />
          </Form.Item>
          <Form.Item label="保養備註" name="note">
            <Input.TextArea rows={2} placeholder="可留空" />
          </Form.Item>
          <Form.Item label="保養日期" name="date" initialValue={dayjs()}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="保養人員" name="staff" rules={[{ required: true }]}>
            <Input placeholder="輸入名稱" />
          </Form.Item>
          <Form.Item label="上傳圖片">
            <Upload
              multiple
              beforeUpload={() => false}
              fileList={files}
              onChange={({ fileList }) => setFiles(fileList)}
            >
              <Button icon={<UploadOutlined />}>選擇圖片</Button>
            </Upload>
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">儲存紀錄</Button>
            <Button htmlType="button" onClick={() => { form.resetFields(); setFiles([]); }}>清除</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default Start;
