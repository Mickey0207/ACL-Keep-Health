import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Button, InputItem, WhiteSpace, WingBlank } from '@ant-design/react-native';
import { useState } from 'react';
import { useAppStore } from '@/store';
import { colors, spacing, borderRadius, shadow } from '@/theme';

export default function Sites() {
  const { sites, addSite, removeSite } = useAppStore();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏢 案場管理</Text>
        <Text style={styles.headerCount}>共 {sites.length} 個案場</Text>
      </View>

      <WingBlank size="lg">
        {/* Add Site Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>➕ 新增案場</Text>
          <WhiteSpace size="md" />
          <InputItem
            value={name}
            onChange={setName}
            placeholder="案場名稱"
            clear
            placeholderTextColor={colors.textLight}
          />
          <WhiteSpace size="sm" />
          <InputItem
            value={address}
            onChange={setAddress}
            placeholder="地址（選填）"
            clear
            placeholderTextColor={colors.textLight}
          />
          <WhiteSpace size="md" />
          <Button
            type="primary"
            onPress={() => {
              if (!name.trim()) return;
              addSite({ id: Date.now().toString(), name: name.trim(), address: address.trim() || undefined });
              setName('');
              setAddress('');
            }}
          >
            確認新增
          </Button>
        </View>

        <WhiteSpace size="lg" />

        {/* Sites List */}
        <Text style={styles.sectionTitle}>📋 案場列表</Text>
        <WhiteSpace size="md" />

        {sites.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>尚無案場，請先新增</Text>
          </View>
        ) : (
          sites.map((s) => (
            <Link key={s.id} href={{ pathname: '/site-detail', params: { id: s.id } }} asChild>
              <View style={styles.siteCard}>
                <View style={styles.siteInfo}>
                  <Text style={styles.siteName}>{s.name}</Text>
                  {s.address && <Text style={styles.siteAddress}>📍 {s.address}</Text>}
                </View>
                <Button
                  size="small"
                  onPress={(e) => {
                    e.stopPropagation?.();
                    removeSite(s.id);
                  }}
                  style={styles.deleteBtn}
                >
                  刪除
                </Button>
              </View>
            </Link>
          ))
        )}

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
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: spacing.sm,
  },
  headerCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadow.light,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  emptyCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadow.light,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
  },
  siteCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadow.light,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  siteInfo: {
    flex: 1,
  },
  siteName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  siteAddress: {
    fontSize: 12,
    color: colors.textLight,
  },
  deleteBtn: {
    marginLeft: spacing.md,
  },
});
