import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import SecurityService from '../services/SecurityService';

export default function WelcomeScreen() {
  const router = useRouter();
  const securityService = SecurityService.getInstance();

  useEffect(() => {
    // We let _layout.tsx handle the initial splash-to-PIN navigation
    // this index file just serves as the root entry point
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.logoContainer}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="bank-transfer" size={48} color="#fff" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.boldText}>SADA</Text>
          <Text style={styles.regularText}>PAY</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF7B7B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boldText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1,
  },
  regularText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '400',
    letterSpacing: 1,
  },
}); 