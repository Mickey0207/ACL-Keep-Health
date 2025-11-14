import React from 'react';
import { Layout } from 'antd';

interface RootNavProps {
  mode: 'root' | 'site';
  activeKey: string;
  onChange: (key: string) => void;
  siteId?: string;
}

const BottomNav: React.FC<RootNavProps> = ({ mode, activeKey, onChange, siteId }) => {
  const items =
    mode === 'root'
      ? [
          { key: 'sites', label: '案場列表' }
        ]
      : [
          { key: 'list', label: '案場列表' },
          { key: 'start', label: '保養開始' },
          { key: 'records', label: '保養記錄' },
          { key: 'manage', label: '案場管理' },
          { key: 'export', label: '輸出照片' }
        ];

  return (
    <Layout.Footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        zIndex: 10
      }}
    >
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onChange(it.key)}
          style={{
            background: 'transparent',
            border: 'none',
            color: activeKey === it.key ? '#0ea5e9' : '#64748b',
            fontWeight: activeKey === it.key ? 600 : 500,
            padding: '6px 8px'
          }}
        >
          {it.label}
        </button>
      ))}
    </Layout.Footer>
  );
};

export default BottomNav;
