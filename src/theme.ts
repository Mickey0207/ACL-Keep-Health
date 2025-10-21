// 主題顏色與排版設定
export const colors = {
  primary: '#1890ff', // 藍色主色
  success: '#52c41a', // 綠色成功
  warning: '#faad14', // 黃色警告
  error: '#f5222d', // 紅色錯誤
  info: '#1890ff', // 資訊藍
  bg: '#f5f7fa', // 背景淺灰
  cardBg: '#ffffff', // 卡片白色
  text: '#262626', // 深灰文字
  textLight: '#8c8c8c', // 淺灰文字
  border: '#d9d9d9', // 邊框灰
  divider: '#f0f0f0', // 分割線
  gradient1: '#1890ff',
  gradient2: '#52c41a',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const shadow = {
  light: {
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    elevation: 2,
  } as any,
  medium: {
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    elevation: 4,
  } as any,
  heavy: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    elevation: 6,
  } as any,
};
