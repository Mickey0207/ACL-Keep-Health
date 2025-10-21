import { useRouter } from 'expo-router';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button, WhiteSpace, WingBlank, InputItem, Toast } from '@ant-design/react-native';
import { useState } from 'react';
import { colors, spacing, borderRadius, shadow } from '@/theme';

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    // Placeholder auth: accept any non-empty
    if (email && password) {
      await new Promise(r => setTimeout(r, 500)); // simulate network delay
      router.replace('/home');
    } else {
      Toast.fail('請輸入帳號與密碼');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
      {/* Header Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>🏗️</Text>
        <Text style={styles.appName}>ACL Keep Health</Text>
        <Text style={styles.tagline}>季保養管理系統</Text>
      </View>

      <WingBlank size="lg">
        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>用戶登入</Text>
          <Text style={styles.cardSubtitle}>目前為本地測試，任意非空 Email/Password 皆可登入</Text>
          <WhiteSpace size="lg" />

          <InputItem
            clear
            value={email}
            onChange={setEmail}
            placeholder="輸入 Email"
            placeholderTextColor={colors.textLight}
            style={styles.input}
          />
          <WhiteSpace size="md" />
          <InputItem
            clear
            value={password}
            onChange={setPassword}
            placeholder="輸入密碼"
            type="password"
            placeholderTextColor={colors.textLight}
            style={styles.input}
          />
        </View>

        <WhiteSpace size="xl" />
        <Button
          type="primary"
          onPress={onLogin}
          loading={loading}
          style={styles.loginBtn}
        >
          登入
        </Button>

        <WhiteSpace size="xl" />
        <Text style={styles.hint}>
          💡 提示：此階段為本地驗證示範，實際登入將以 Supabase 承接
        </Text>
      </WingBlank>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.bg,
    justifyContent: 'space-between',
  },
  banner: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadow.medium,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 18,
  },
  input: {
    borderBottomColor: colors.border,
  },
  loginBtn: {
    height: 48,
    borderRadius: borderRadius.md,
  },
  hint: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
});
