import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '../components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import TransactionService from '../services/TransactionService';
import SecurityService from '../services/SecurityService';

export default function PinConfirmationScreen() {
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const mode = params.mode as 'login' | 'transaction' || 'transaction';
  const securityService = SecurityService.getInstance();

  const handleSuccess = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (mode === 'login') {
      securityService.setAuthenticated(true);
      router.replace('/(tabs)');
    } else {
      processTransaction();
    }
  };

  const processTransaction = async () => {
    if (!params.amount || !params.accountInfo) {
      Alert.alert('Error', 'Missing transaction details');
      return;
    }
    
    setIsProcessing(true);
    const transactionService = TransactionService.getInstance();

    try {
      const result = await transactionService.processTransaction({
        amount: Number(params.amount),
        senderWalletId: 'user123',
        recipientAccount: params.accountInfo as string,
        recipientBank: (params.bankName as string) || 'TMB',
        bankId: params.bankLogo as string,
        recipientName: params.recipientName as string,
        purpose: (params.purpose as string) || 'Others',
        note: params.note as string,
        referenceNumber: params.referenceNumber as string
      });

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push({
          pathname: '/done-receipt',
          params: {
            ...params,
            referenceNumber: params.referenceNumber || result.referenceNumber
          }
        });
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        await transactionService.handleTransactionError(result.error || 'Transaction failed');
        setPin('');
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      await transactionService.handleTransactionError('An unexpected error occurred');
      setPin('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNumberPress = (num: string) => {
    if (isProcessing) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (pin.length < 5) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 5) {
        if (securityService.validatePin(newPin)) {
          handleSuccess();
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert('Incorrect PIN');
          setPin('');
          // Re-enable input after error alert
          setIsProcessing(false);
        }
      }
    }
  };

  const handleBackspace = () => {
    if (isProcessing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPin(prev => prev.slice(0, -1));
  };

  if (isProcessing) {
    return (
      <View style={[styles.container, styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#fff" />
        <ThemedText style={styles.loadingText}>Processing your transaction...</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        {mode === 'transaction' && (
          <TouchableOpacity onPress={() => router.back()} style={styles.headerLeft}>
            <MaterialCommunityIcons name="chevron-left" size={32} color="#fff" />
          </TouchableOpacity>
        )}
        <View style={styles.headerCenter}>
          <ThemedText style={styles.headerTitle}>
            {mode === 'login' ? 'Verification' : 'Confirm Transaction'}
          </ThemedText>
        </View>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.title}>
          {mode === 'login' ? 'Enter PIN to unlock' : 'Enter PIN to confirm'}
        </ThemedText>

        <View style={styles.pinContainer}>
          {[...Array(5)].map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.pinDot,
                pin.length > index && styles.pinDotFilled
              ]} 
            />
          ))}
        </View>

        <TouchableOpacity style={styles.forgotPin}>
          <ThemedText style={styles.forgotPinText}>Forgot PIN?</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.keypadContainer}>
        <View style={styles.keypadRow}>
          {['1', '2', '3'].map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.keypadButton}
              onPress={() => handleNumberPress(num)}
            >
              <ThemedText style={styles.keypadText}>{num}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keypadRow}>
          {['4', '5', '6'].map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.keypadButton}
              onPress={() => handleNumberPress(num)}
            >
              <ThemedText style={styles.keypadText}>{num}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keypadRow}>
          {['7', '8', '9'].map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.keypadButton}
              onPress={() => handleNumberPress(num)}
            >
              <ThemedText style={styles.keypadText}>{num}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keypadRow}>
          <View style={styles.keypadButton} />
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={() => handleNumberPress('0')}
          >
            <ThemedText style={styles.keypadText}>0</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={handleBackspace}
          >
            <MaterialCommunityIcons name="backspace-outline" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF7363',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  headerLeft: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 32,
  },
  content: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 40,
  },
  pinContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  pinDotFilled: {
    backgroundColor: '#fff',
  },
  forgotPin: {
    marginTop: 10,
  },
  forgotPinText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  keypadContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  keypadButton: {
    flex: 1,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '500',
  },
});
