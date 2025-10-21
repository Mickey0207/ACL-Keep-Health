import { useLocalSearchParams } from 'expo-router';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button, InputItem, Picker, WhiteSpace, WingBlank } from '@ant-design/react-native';
import { useState, useMemo } from 'react';
import { useAppStore, Season } from '@/store';
import { colors, spacing, borderRadius, shadow } from '@/theme';

export default function SiteDetail() {
  const params = useLocalSearchParams();
  const id = (params as any).id as string | undefined;
  const { sites, maintenance, addMaintenance, removeMaintenance } = useAppStore();
  const site = sites.find((s) => s.id === id);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [season, setSeason] = useState<Season>('Q1');

  const items = useMemo(() => maintenance.filter((m) => m.siteId === id), [maintenance, id]);

  if (!site) return (
    <View style={styles.container}>
      <WingBlank>
        <Text style={styles.errorText}>找不到此案場</Text>
      </WingBlank>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏢 {site.name}</Text>
        {site.address && <Text style={styles.headerAddress}>📍 {site.address}</Text>}
        <Text style={styles.headerCount}>季保養項目：{items.length}</Text>
      </View>

      <WingBlank size="lg">
        <WhiteSpace size="lg" />

        {/* Add Item Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>➕ 新增季保養項目</Text>
          <WhiteSpace size="md" />
          <InputItem
            value={title}
            onChange={setTitle}
            placeholder="項目標題"
            clear
            placeholderTextColor={colors.textLight}
          />
          <WhiteSpace size="sm" />
          <InputItem
            type="number"
            value={String(year)}
            onChange={(v) => setYear(Number(v))}
            placeholder="年份"
            clear
            placeholderTextColor={colors.textLight}
          />
          <WhiteSpace size="sm" />
          <Picker
            data={[
              { label: '第一季 (Q1)', value: 'Q1' },
              { label: '第二季 (Q2)', value: 'Q2' },
              { label: '第三季 (Q3)', value: 'Q3' },
              { label: '第四季 (Q4)', value: 'Q4' },
            ]}
            cols={1}
            value={[season]}
            onChange={(v) => setSeason(v[0] as Season)}
          >
            <Text style={styles.pickerLabel}>選擇季度: {season}</Text>
          </Picker>
          <WhiteSpace size="md" />
          <Button
            type="primary"
            onPress={() => {
              if (!title.trim()) return;
              addMaintenance({
                id: Date.now().toString(),
                siteId: id!,
                title: title.trim(),
                year,
                season,
              });
              setTitle('');
            }}
          >
            確認新增
          </Button>
        </View>

        <WhiteSpace size="lg" />

        {/* Items List */}
        <Text style={styles.sectionTitle}>📋 項目列表</Text>
        <WhiteSpace size="md" />

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>尚無季保養項目</Text>
            <Text style={styles.emptyHint}>請先新增項目</Text>
          </View>
        ) : (
          items.map((m) => (
            <View key={m.id} style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemYear}>{m.year} 年 {m.season} 季</Text>
                <Text style={styles.itemTitle}>{m.title}</Text>
              </View>
              <Button
                size="small"
                onPress={() => removeMaintenance(m.id)}
                style={styles.deleteBtn}
              >
                刪除
              </Button>
            </View>
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
  headerAddress: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.sm,
  },
  headerCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.xl,
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
  pickerLabel: {
    fontSize: 14,
    color: colors.text,
    paddingVertical: spacing.md,
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
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyHint: {
    fontSize: 12,
    color: colors.textLight,
  },
  itemCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadow.light,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  itemInfo: {
    flex: 1,
  },
  itemYear: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  deleteBtn: {
    marginLeft: spacing.md,
  },
});
