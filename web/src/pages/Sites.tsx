import { useNavigate } from 'react-router-dom'
import { Card, Typography, Layout } from 'antd'
import { UnorderedListOutlined } from '@ant-design/icons'

const demoSites = [
  { id: 's1', name: '中山大樓', address: '台北市中山區 xxx 路 1 號' },
  { id: 's2', name: '信義廣場', address: '台北市信義區 xxx 路 88 號' }
]

export default function SitesPage() {
  const navigate = useNavigate()

  return (
    <Layout style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Layout.Header
        style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
          padding: '16px 24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography.Title
          level={3}
          style={{ margin: 0, color: '#ffffff' }}
        >
          案場列表
        </Typography.Title>
      </Layout.Header>

      <Layout.Content style={{ flex: 1, padding: '24px 16px', background: '#f5f5f5', paddingBottom: 88 }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16
            }}
          >
            {demoSites.map((s) => (
              <Card
                key={s.id}
                hoverable
                onClick={() => navigate(`/site/${s.id}`)}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: 8
                }}
              >
                <Typography.Title level={5} style={{ marginBottom: 8 }}>
                  {s.name}
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {s.address}
                </Typography.Text>
              </Card>
            ))}
          </div>

          {demoSites.length === 0 && (
            <Card style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Typography.Text type="secondary">
                目前沒有案場，請聯繫管理員新增
              </Typography.Text>
            </Card>
          )}
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
          justifyContent: 'center',
          alignItems: 'stretch'
        }}
      >
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
          title="案場列表"
        >
          <UnorderedListOutlined style={{ fontSize: 20, marginBottom: 4 }} />
          <span style={{ fontSize: 11 }}>案場列表</span>
        </div>
      </Layout.Footer>
    </Layout>
  )
}
