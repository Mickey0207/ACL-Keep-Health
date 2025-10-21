import { Platform, View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button, WhiteSpace, WingBlank, Toast, InputItem } from '@ant-design/react-native';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useState } from 'react';
import { colors, spacing, borderRadius, shadow } from '@/theme';

async function fetchAsBlob(url: string): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`下載失敗: ${url}`);
  return await res.blob();
}

export default function WebDownload() {
  const [downloading, setDownloading] = useState(false);
  const [siteId, setSiteId] = useState('demo-site');
  const [season, setSeason] = useState('Q1');

  const onZip = async () => {
    if (Platform.OS !== 'web') {
      Toast.info('ZIP 下載僅限瀏覽器');
      return;
    }
    try {
      setDownloading(true);
      const zip = new JSZip();
      // Mock images (replace with signed URLs later)
      const urls = [
        'https://picsum.photos/seed/1/800/600',
        'https://picsum.photos/seed/2/800/600',
      ];
      await Promise.all(urls.map(async (u, idx) => {
        const b = await fetchAsBlob(u);
        zip.file(`photo_${idx + 1}.jpg`, b);
      }));
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${siteId}-${season}.zip`);
      Toast.success('已開始下載');
    } catch (e: any) {
      Toast.fail(e.message ?? '壓縮下載失敗');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📥 壓縮檔下載</Text>
        <Text style={styles.headerSubtitle}>Web 端批量下載照片</Text>
      </View>

      <WingBlank size="lg">
        <WhiteSpace size="lg" />

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>此功能限瀏覽器使用，選擇案場與季度後下載</Text>
        </View>

        <WhiteSpace size="lg" />

        {/* Selection Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 選擇下載項目</Text>
          <WhiteSpace size="md" />
          <InputItem
            value={siteId}
            onChange={setSiteId}
            placeholder="案場 ID（示範值）"
            clear
          />
          <WhiteSpace size="sm" />
          <InputItem
            value={season}
            onChange={setSeason}
            placeholder="季度（Q1-Q4）"
            clear
          />
        </View>

        <WhiteSpace size="lg" />
        <Button
          type="primary"
          size="large"
          onPress={onZip}
          loading={downloading}
          disabled={downloading}
          style={styles.downloadBtn}
        >
          {downloading ? '下載中...' : '打包並下載 ZIP'}
        </Button>

        <WhiteSpace size="lg" />

        {/* Steps Card */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>📖 使用步驟</Text>
          <WhiteSpace size="md" />
          <View style={styles.stepRow}>
            <Text style={styles.stepNum}>1</Text>
            <Text style={styles.stepText}>輸入案場 ID（選填）</Text>
          </View>
          <View style={styles.stepRow}>
            <Text style={styles.stepNum}>2</Text>
            <Text style={styles.stepText}>選擇要下載的季度</Text>
          </View>
          <View style={styles.stepRow}>
            <Text style={styles.stepNum}>3</Text>
            <Text style={styles.stepText}>點擊下載按鈕開始</Text>
          </View>
        </View>

        <WhiteSpace size="xl" />

        {/* Note */}
        <Text style={styles.note}>
          💡 注：此為示範頁面，實際會連結 Supabase Storage 簽名網址
        </Text>

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
    backgroundColor: colors.warning,
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
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  infoCard: {
    backgroundColor: '#fffbe6',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
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
  downloadBtn: {
    height: 48,
    borderRadius: borderRadius.md,
  },
  stepsCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadow.light,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    color: '#ffffff',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: spacing.md,
  },
  stepText: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
  note: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
});
