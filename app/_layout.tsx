import { Stack, useRouter } from 'expo-router';
import { useColorScheme, View, Image, StyleSheet, Animated } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import SecurityService from '../services/SecurityService';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const securityService = SecurityService.getInstance();

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need here
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // 1. Start animation sequence (3 seconds total)
      const animation = Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: (t) => t * (2 - t),
        }),
        Animated.delay(1500),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: (t) => t * t,
        }),
      ]);
      
      animation.start();

      // 2. Force Navigation after exactly 3000ms
      const timer = setTimeout(() => {
        // Stop animation and clean up
        animation.stop();
        setShowSplash(false);
        
        // Use replace to remove Splash from history
        router.replace('/pin-confirmation?mode=login');
      }, 3000);

      return () => {
        clearTimeout(timer);
        animation.stop();
      };
    }
  }, [appIsReady, fadeAnim]);

  return (
    <View style={{ flex: 1 }}>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 300,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="pin-confirmation" 
          options={{ 
            presentation: 'modal',
            animation: 'slide_from_bottom',
            gestureEnabled: false,
          }} 
        />
        <Stack.Screen 
          name="send-money" 
          options={{ 
            presentation: 'card',
            animation: 'slide_from_right'
          }} 
        />
        <Stack.Screen 
          name="select-recipient" 
          options={{ 
            presentation: 'card',
            animation: 'slide_from_right'
          }} 
        />
        <Stack.Screen 
          name="confirm-payment" 
          options={{ 
            presentation: 'card',
            animation: 'slide_from_right'
          }} 
        />
        <Stack.Screen 
          name="done-receipt" 
          options={{ 
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: 'vertical'
          }} 
        />
        <Stack.Screen 
          name="transaction-details" 
          options={{ 
            presentation: 'card',
            animation: 'slide_from_right',
            headerShown: false
          }} 
        />
      </Stack>

      {showSplash && (
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.splashContainer}>
            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
              <Image
                source={require('../assets/images/sadapay-logo.jpg')}
                style={styles.splashLogo}
                resizeMode="contain"
              />
            </Animated.View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FF7363', // SadaPay brand secondary color
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 140,
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  splashLogo: {
    width: 100,
    height: 50,
  },
}); 