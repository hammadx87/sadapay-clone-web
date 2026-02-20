import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, TextInput, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '../components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import TransactionService from '../services/TransactionService';
import { getBankById } from '../constants/Banks';

import { STATIC_SENDER } from '../constants/User';

export default function ConfirmPaymentScreen() {
  const router = useRouter();
  const { amount, recipientName, accountInfo, bankLogo, bankName } = useLocalSearchParams();
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const insets = useSafeAreaInsets();
  const [referenceNumber] = useState(() => {
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    return `Raast-${randomDigits}`;
  });

  const selectedBank = getBankById(bankLogo as string);

  const handleSendMoney = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsProcessing(true);
    const transactionService = TransactionService.getInstance();

    try {
      const numericAmount = Number(amount.toString().replace(/,/g, ''));
      const balanceCheck = await transactionService.checkBalance(numericAmount);
      
      if (!balanceCheck.isValid) {
        await transactionService.handleTransactionError(balanceCheck.error || 'Insufficient balance');
        return;
      }

      router.push({
        pathname: "/pin-confirmation",
        params: {
          amount: numericAmount,
          recipientName,
          accountInfo,
          note,
          bankLogo,
          bankName,
          referenceNumber,
          mode: 'transaction'
        }
      });
    } catch (error) {
      await transactionService.handleTransactionError('Unable to process your request.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => !isProcessing && router.back()} 
          style={styles.headerLeft}
          disabled={isProcessing}
        >
          <MaterialCommunityIcons name="chevron-left" size={32} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <ThemedText style={styles.headerTitle}>Confirm</ThemedText>
        </View>
        <TouchableOpacity 
          onPress={() => !isProcessing && router.back()} 
          style={styles.headerRight}
          disabled={isProcessing}
        >
          <MaterialCommunityIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.senderSummary}>
          <ThemedText style={styles.fromLabel}>From</ThemedText>
          <ThemedText style={styles.senderDetails}>{STATIC_SENDER.bankName} • {STATIC_SENDER.name}</ThemedText>
        </View>

        <View style={styles.recipientCard}>
          <View style={styles.recipientInfo}>
            <View style={styles.recipientIcon}>
              <Image 
                source={selectedBank.logo} 
                style={styles.bankLogoImage} 
                resizeMode="cover"
              />
            </View>
            <View style={styles.recipientDetails}>
              <ThemedText style={styles.recipientName}>{recipientName}</ThemedText>
              <ThemedText style={styles.accountNumber}>{accountInfo}</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.amountSection}>
          <ThemedText style={styles.sectionLabel}>Recipient will get</ThemedText>
          <ThemedText style={styles.amountText}>Rs. {amount}</ThemedText>
          
          <View style={styles.feeContainer}>
            <ThemedText style={styles.feeLabel}>Sender fee</ThemedText>
            <View style={styles.feeAmount}>
              <ThemedText style={styles.feeText}>Rs. 0</ThemedText>
              <ThemedText style={styles.feeEmoji}>🎉</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.purposeSection}>
          <ThemedText style={styles.sectionLabel}>Reference number</ThemedText>
          <View style={styles.purposeDropdown}>
            <ThemedText style={styles.dropdownText}>{referenceNumber}</ThemedText>
          </View>
        </View>

        <View style={styles.purposeSection}>
          <ThemedText style={styles.sectionLabel}>Purpose</ThemedText>
          <TouchableOpacity style={styles.purposeDropdown}>
            <ThemedText style={styles.dropdownText}>Others</ThemedText>
            <MaterialCommunityIcons name="chevron-down" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.noteSection}>
          <ThemedText style={styles.sectionLabel}>Add a note</ThemedText>
          <View style={styles.noteInputContainer}>
            <TextInput
              style={styles.noteInput}
              placeholder="e.g. today's lunch 🍕"
              value={note}
              onChangeText={setNote}
              maxLength={140}
            />
            <ThemedText style={styles.charCount}>{note.length}/140</ThemedText>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.sendButton, isProcessing && styles.sendButtonDisabled]}
        onPress={handleSendMoney}
        disabled={isProcessing}
      >
        <ThemedText style={styles.sendButtonText}>
          {isProcessing ? 'Checking...' : `Send Rs. ${amount}`}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  senderSummary: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  fromLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  senderDetails: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  recipientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  bankLogoImage: {
    width: '100%',
    height: '100%',
  },
  recipientDetails: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: '#666',
  },
  amountSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeLabel: {
    fontSize: 14,
    color: '#666',
  },
  feeAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeText: {
    fontSize: 14,
    color: '#00C853',
    marginRight: 4,
  },
  feeEmoji: {
    fontSize: 16,
  },
  purposeSection: {
    marginBottom: 24,
  },
  purposeDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
  },
  dropdownText: {
    fontSize: 16,
  },
  noteSection: {
    marginBottom: 24,
  },
  noteInputContainer: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
  },
  noteInput: {
    fontSize: 16,
    minHeight: 40,
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 8,
  },
  sendButton: {
    backgroundColor: '#FF7B7B',
    padding: 16,
    borderRadius: 12,
    margin: 16,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
}); 