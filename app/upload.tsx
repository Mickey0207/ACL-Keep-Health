import { View, Image, StyleSheet, Platform, ScrollView, Text } from 'react-native';
import { Button, WhiteSpace, WingBlank, Toast } from '@ant-design/react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useState } from 'react';
import { colors, spacing, borderRadius, shadow } from '@/theme';

type Picked = { uri: string; width: number; height: number };

export default function Upload() {
  const [photos, setPhotos] = useState<Picked[]>([]);

  const pickImage = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') {
      Toast.fail('需要相機權限');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      aspect: [4, 3],
      quality: 0.8,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    // Ensure 4:3 by cropping if necessary
    const targetRatio = 4 / 3;
    const currRatio = asset.width / asset.height;
    let manipulated = { uri: asset.uri, width: asset.width, height: asset.height } as Picked;

    if (Math.abs(currRatio - targetRatio) > 0.01) {
      const targetWidth = currRatio > targetRatio ? Math.floor(asset.height * targetRatio) : asset.width;
      const targetHeight = currRatio > targetRatio ? asset.height : Math.floor(asset.width / targetRatio);
      const originX = Math.floor((asset.width - targetWidth) / 2);
      const originY = Math.floor((asset.height - targetHeight) / 2);
      const out = await ImageManipulator.manipulateAsync(asset.uri, [
        { crop: { originX, originY, width: targetWidth, height: targetHeight } },
      ], { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG });
      manipulated = { uri: out.uri, width: targetWidth, height: targetHeight };
    }

    setPhotos((p) => [manipulated, ...p]);
    Toast.success('照片已加入');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📷 上傳照片</Text>
        <Text style={styles.headerSubtitle}>強制 4:3 比例，自動壓縮</Text>
      </View>

      <WingBlank size="lg">
        <WhiteSpace size="lg" />
        
        {/* Camera Button Card */}
        <View style={styles.cameraCard}>
          <Text style={styles.cameraIcon}>📸</Text>
          <Text style={styles.cameraText}>點擊下方按鈕拍照</Text>
          <Text style={styles.cameraHint}>照片會自動裁切為 4:3</Text>
        </View>

        <WhiteSpace size="md" />
        <Button type="primary" size="large" onPress={pickImage} style={styles.cameraBtn}>
          開啟相機拍照
        </Button>

        <WhiteSpace size="lg" />

        {/* Photos Grid */}
        {photos.length > 0 && (
          <>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>✓ 已上傳 {photos.length} 張</Text>
            </View>
            <WhiteSpace size="md" />
            <View style={styles.photoGrid}>
              {photos.map((p, i) => (
                <View key={i} style={styles.photoItem}>
                  <Image
                    source={{ uri: p.uri }}
                    style={styles.photoImage}
                  />
                  <Button
                    size="small"
                    onPress={() => setPhotos((ph) => ph.filter((_, idx) => idx !== i))}
                    style={styles.deletePhotoBtn}
                  >
                    移除
                  </Button>
                </View>
              ))}
            </View>
          </>
        )}

        {photos.length === 0 && (
          <>
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🖼️</Text>
              <Text style={styles.emptyText}>尚無照片</Text>
              <Text style={styles.emptyHint}>拍照後將顯示在此</Text>
            </View>
          </>
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
    backgroundColor: colors.success,
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
  cameraCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadow.light,
  },
  cameraIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  cameraText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  cameraHint: {
    fontSize: 12,
    color: colors.textLight,
  },
  cameraBtn: {
    height: 48,
    borderRadius: borderRadius.md,
  },
  countBadge: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignSelf: 'flex-start',
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoItem: {
    width: '48%',
    marginBottom: spacing.md,
  },
  photoImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  deletePhotoBtn: {
    alignSelf: 'center',
  },
  emptyState: {
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyHint: {
    fontSize: 12,
    color: colors.textLight,
  },
});
