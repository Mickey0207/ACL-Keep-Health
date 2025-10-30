import { Card, Alert, Typography, Button, Divider, Space } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

export default function ExportPhotos() {
  const handleExport = () => {
    console.log('Export photos as ZIP')
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
        輸出照片
      </Typography.Title>

      <Alert
        type="info"
        message="照片輸出規則"
        description={
          <div>
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>照片將按「維運系統」分資料夾</li>
              <li>
                檔名格式：
                <Typography.Text code style={{ fontSize: 12 }}>
                  維運系統_保養內容_保養備註_保養人員_流水號.jpg
                </Typography.Text>
              </li>
              <li>最後打包為 ZIP 檔供下載</li>
            </ul>
          </div>
        }
        showIcon
        style={{ marginBottom: 20 }}
      />

      <Typography.Title level={5} style={{ marginTop: 16, marginBottom: 12 }}>
        輸出內容預覽
      </Typography.Title>

      <div
        style={{
          background: '#f5f5f5',
          padding: 12,
          borderRadius: 6,
          marginBottom: 16,
          fontFamily: 'monospace',
          fontSize: 12,
          lineHeight: 1.6,
          overflow: 'auto'
        }}
      >
        <div>📁 案場_s1_2025-10-28.zip</div>
        <div style={{ marginLeft: 16 }}>
          <div>📁 消防</div>
          <div style={{ marginLeft: 16 }}>
            <div>📄 消防_檢查滅火器_安全_李小美_001.jpg</div>
            <div>📄 消防_檢查滅火器_安全_李小美_002.jpg</div>
          </div>
          <div>📁 空調</div>
          <div style={{ marginLeft: 16 }}>
            <div>📄 空調_清潔濾網_定期_王小明_001.jpg</div>
          </div>
        </div>
      </div>

      <Divider />

      <Space>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          size="large"
          onClick={handleExport}
          style={{ minWidth: 120 }}
        >
          下載 ZIP
        </Button>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          共 0 張照片待輸出
        </Typography.Text>
      </Space>
    </Card>
  )
}
