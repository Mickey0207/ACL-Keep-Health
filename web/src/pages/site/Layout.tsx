import React from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Layout } from 'antd';
import BottomNav from '../../components/BottomNav';

const SiteLayout: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const pathKey = location.pathname.split('/').pop() || 'start';
  return (
    <Layout style={{ minHeight: '100dvh', background: '#f7fafc' }}>
      <Layout.Content style={{ paddingBottom: 64 }}>
        <Outlet />
      </Layout.Content>
      <BottomNav
        mode="site"
        activeKey={pathKey}
        siteId={id}
        onChange={(key) => {
          if (key === 'list') navigate('/sites');
          else navigate(`/site/${id}/${key}`);
        }}
      />
    </Layout>
  );
};

export default SiteLayout;
