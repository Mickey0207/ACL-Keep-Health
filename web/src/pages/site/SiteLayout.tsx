import { Outlet, Link, useParams, useLocation } from 'react-router-dom'
import { Layout, Button } from 'antd'
import {
  ArrowLeftOutlined,
  FormOutlined,
  FileTextOutlined,
  PlusOutlined,
  SettingOutlined,
  DownloadOutlined
} from '@ant-design/icons'

export default function SiteLayout() {
  const { siteId } = useParams()
  const location = useLocation()

  const activeKey = location.pathname.split('/').pop() || 'start'

  return (
    <Layout style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Layout.Header
        style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div style={{ color: '#ffffff', fontSize: 16, fontWeight: 600 }}>
          案場 {siteId}
        </div>
        <Button
          type="primary"
          ghost
          icon={<ArrowLeftOutlined />}
          href="/sites"
          style={{ borderColor: '#ffffff', color: '#ffffff' }}
        >
          返回
        </Button>
      </Layout.Header>

      <Layout.Content style={{ flex: 1, padding: '16px 12px', background: '#f5f5f5', paddingBottom: 88 }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Outlet />
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
          justifyContent: 'space-around',
          alignItems: 'stretch'
        }}
      >
        <Link
          to="start"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            textDecoration: 'none',
            color: activeKey === 'start' ? '#0ea5e9' : '#999999',
            borderBottom: activeKey === 'start' ? '3px solid #0ea5e9' : 'none',
            transition: 'all 0.3s ease'
          }}
          title="保養開始"
        >
          <FormOutlined style={{ fontSize: 20, marginBottom: 4 }} />
          <span style={{ fontSize: 11 }}>保養開始</span>
        </Link>

        <Link
          to="records"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            textDecoration: 'none',
            color: activeKey === 'records' ? '#0ea5e9' : '#999999',
            borderBottom: activeKey === 'records' ? '3px solid #0ea5e9' : 'none',
            transition: 'all 0.3s ease'
          }}
          title="保養記錄"
        >
          <FileTextOutlined style={{ fontSize: 20, marginBottom: 4 }} />
          <span style={{ fontSize: 11 }}>保養記錄</span>
        </Link>

        <Link
          to="create"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            textDecoration: 'none',
            color: activeKey === 'create' ? '#0ea5e9' : '#999999',
            borderBottom: activeKey === 'create' ? '3px solid #0ea5e9' : 'none',
            transition: 'all 0.3s ease'
          }}
          title="新增項目"
        >
          <PlusOutlined style={{ fontSize: 20, marginBottom: 4 }} />
          <span style={{ fontSize: 11 }}>新增項目</span>
        </Link>

        <Link
          to="manage"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            textDecoration: 'none',
            color: activeKey === 'manage' ? '#0ea5e9' : '#999999',
            borderBottom: activeKey === 'manage' ? '3px solid #0ea5e9' : 'none',
            transition: 'all 0.3s ease'
          }}
          title="案場管理"
        >
          <SettingOutlined style={{ fontSize: 20, marginBottom: 4 }} />
          <span style={{ fontSize: 11 }}>案場管理</span>
        </Link>

        <Link
          to="export"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            textDecoration: 'none',
            color: activeKey === 'export' ? '#0ea5e9' : '#999999',
            borderBottom: activeKey === 'export' ? '3px solid #0ea5e9' : 'none',
            transition: 'all 0.3s ease'
          }}
          title="輸出照片"
        >
          <DownloadOutlined style={{ fontSize: 20, marginBottom: 4 }} />
          <span style={{ fontSize: 11 }}>輸出照片</span>
        </Link>
      </Layout.Footer>
    </Layout>
  )
}
