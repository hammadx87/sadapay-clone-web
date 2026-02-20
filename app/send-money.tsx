import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import TransactionService from '../services/TransactionService';

export default function SendMoneyScreen() {
  const [amount, setAmount] = useState('0');
  const [balance, setBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Get current balance from service
  useEffect(() => {
    const transactionService = TransactionService.getInstance();
    
    // Initial load
    setBalance(transactionService.getBalance());
    
    // Subscribe to updates
    const unsubscribe = transactionService.addListener(() => {
      setBalance(transactionService.getBalance());
    });
    
    // Cleanup subscription
    return unsubscribe;
  }, []);

  const formatAmount = (value: string) => {
    // Remove any non-digit characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    let formattedValue = parts[0];
    if (parts.length > 1) {
      formattedValue += '.' + parts[1].slice(0, 2); // Keep only 2 decimal places
    }

    // Add commas for thousands
    const withCommas = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return withCommas;
  };

  const handleNumberPress = (num: string) => {
    if (isProcessing) return;
    setAmount(prev => {
      if (prev === '0' && num !== '.') {
        return num;
      }
      
      // Handle decimal point
      if (num === '.') {
        if (prev.includes('.')) {
          return prev;
        }
        return prev + '.';
      }

      // Don't allow more than 2 decimal places
      if (prev.includes('.')) {
        const [whole, decimal] = prev.split('.');
        if (decimal && decimal.length >= 2) {
          return prev;
        }
      }

      // Don't allow numbers larger than 999,999,999.99
      const newValue = prev + num;
      const numericValue = parseFloat(newValue.replace(/,/g, ''));
      if (numericValue > 999999999.99) {
        return prev;
      }

      return formatAmount(prev + num);
    });
  };

  const handleBackspace = () => {
    if (isProcessing) return;
    setAmount(prev => {
      if (prev.length <= 1) {
        return '0';
      }
      const newValue = prev.slice(0, -1);
      return formatAmount(newValue);
    });
  };

  const handleSend = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    router.push({
      pathname: '/select-recipient',
      params: { amount }
    });

    // Reset processing state after a short delay to allow navigation
    setTimeout(() => setIsProcessing(false), 1000);
  };

  // Format the balance with commas
  const formattedBalance = balance.toLocaleString('en-IN');

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.topSection}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => !isProcessing && router.back()} 
            style={styles.headerLeft}
            disabled={isProcessing}
          >
            <MaterialCommunityIcons name="chevron-left" size={32} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.balanceContainer}>
              <ThemedText style={styles.balanceLabel}>Current balance</ThemedText>
              <ThemedText style={styles.currentBalance}>Rs. {formattedBalance}</ThemedText>
            </View>
          </View>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.amountContainer}>
          <ThemedText style={styles.amount}>Rs. {amount}</ThemedText>
        </View>
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

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <ThemedText style={styles.actionButtonText}>Request</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, isProcessing && styles.actionButtonDisabled]}
          onPress={handleSend}
          disabled={isProcessing}
        >
          <ThemedText style={styles.actionButtonText}>Send</ThemedText>
        </TouchableOpacity>
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
  topSection: {
    width: '100%',
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
  headerRight: {
    width: 32,
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    fontWeight: '400',
  },
  currentBalance: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  amountContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  amount: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 'bold',
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
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 