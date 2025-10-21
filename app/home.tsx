import { Link } from 'expo-router';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button, WhiteSpace, WingBlank } from '@ant-design/react-native';
import { colors, spacing, borderRadius, shadow } from '@/theme';

type MenuItem = {
  icon: string;
  label: string;
  description: string;
  href: string;
  color: string;
};

const menuItems: MenuItem[] = [
  {
    icon: '🏢',
    label: '案場管理',
    description: '管理所有案場資訊',
    href: '/sites',
    color: '#1890ff',
  },
  {
    icon: '📷',
    label: '上傳照片',
    description: '拍照上傳（4:3）',
    href: '/upload',
    color: '#52c41a',
  },
  {
    icon: '📥',
    label: '下載壓縮檔',
    description: 'Web 端批量下載',
    href: '/web-download',
    color: '#faad14',
  },
];

export default function Home() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👋 歡迎回來</Text>
        <Text style={styles.headerSubtitle}>季保養管理系統</Text>
      </View>

      <WingBlank size="lg">
        <WhiteSpace size="lg" />
        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, idx) => (
            <Link key={idx} href={item.href} asChild>
              <View style={[styles.menuCard, { borderTopColor: item.color }]}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDesc}>{item.description}</Text>
              </View>
            </Link>
          ))}
        </View>

        <WhiteSpace size="xl" />

        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>📊 快速統計</Text>
          <WhiteSpace size="md" />
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>案場</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>季保養</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>照片</Text>
            </View>
          </View>
        </View>

        <WhiteSpace size="xl" />
      </WingBlank>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.bg,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  menuCard: {
    width: '48%',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderTopWidth: 4,
    ...shadow.light,
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  menuDesc: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadow.light,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.divider,
  },
});
