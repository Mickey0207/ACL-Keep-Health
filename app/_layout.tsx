import { Stack } from 'expo-router';
import { Provider } from '@ant-design/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Reduce overscroll bounce on iOS Safari
      const el = document.documentElement;
      const prev = el.style.overscrollBehaviorY;
      el.style.overscrollBehaviorY = 'contain';
      return () => {
        el.style.overscrollBehaviorY = prev;
      };
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider>
          <Stack screenOptions={{ headerShown: false }} />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
