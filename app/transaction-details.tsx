import { StyleSheet, View, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import TransactionService, { TransactionHistoryItem } from '../services/TransactionService';
import { STATIC_SENDER } from '../constants/User';

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;
  const insets = useSafeAreaInsets();
  
  const [transaction, setTransaction] = useState<TransactionHistoryItem | null>(null);
  
  useEffect(() => {
    if (id) {
      const transactionService = TransactionService.getInstance();
      const history = transactionService.getTransactionHistory();
      const foundTransaction = history.find(t => t.id === id);
      
      if (foundTransaction) {
        setTransaction(foundTransaction);
      }
    }
  }, [id]);

  if (!transaction) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading transaction details...</ThemedText>
        </View>
      </View>
    );
  }

  // Format amount value with commas
  const amountValue = transaction.amount.replace(/[^0-9]/g, '');
  const formattedAmount = Number(amountValue).toLocaleString('en-IN');
  
  // Format date and time
  const timeStr = transaction.time;
  const dateStr = transaction.date || 'Today';
  const fullDate = `${dateStr}, ${timeStr}`;

  // Get sender and receiver info based on transaction type
  const isSent = transaction.type === 'sent';
  
  const senderInfo = {
    name: isSent ? (transaction.senderName || STATIC_SENDER.name) : transaction.name,
    account: isSent ? (transaction.senderBank || STATIC_SENDER.bankName) : (transaction.bankName || 'Other Bank'),
    accountNumber: isSent ? `*${STATIC_SENDER.accountMask}` : (transaction.accountInfo || '')
  };
  
  const receiverInfo = {
    name: isSent ? transaction.name : STATIC_SENDER.name,
    bank: isSent ? (transaction.bankName || 'Other Bank') : (transaction.senderBank || STATIC_SENDER.bankName),
    accountNumber: isSent ? (transaction.accountInfo || '') : `*${STATIC_SENDER.accountMask}`
  };

  const referenceNumber = transaction.referenceNumber || `Raast-${parseInt(transaction.id) % 9000000000 + 1000000000}`;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF7B7B" barStyle="light-content" />
      
      {/* Coral header section */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          {/* Back button and title */}
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons name="chevron-left" size={28} color="#fff" />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>Money {transaction.type}</ThemedText>
          </View>
          
          {/* Transaction icon */}
          <View style={styles.transactionIconContainer}>
            <MaterialCommunityIcons 
              name={transaction.type === 'sent' ? "arrow-top-right" : "arrow-bottom-left"}
              size={32} 
              color="#FF7B7B" 
            />
          </View>
          
          {/* Amount */}
          <ThemedText style={styles.amount}>Rs. {formattedAmount}</ThemedText>
          
          {/* From/To information */}
          <View style={styles.transactionParties}>
            <ThemedText style={styles.fromText}>From {senderInfo.name}</ThemedText>
            <ThemedText style={styles.toText}>to {receiverInfo.name}</ThemedText>
          </View>
          
          {/* Date and time */}
          <ThemedText style={styles.dateTime}>{fullDate}</ThemedText>
        </View>
      </View>
      
      {/* Transaction details cards */}
      <View style={styles.detailsContainer}>
        {/* From card */}
        <View style={styles.detailCard}>
          <ThemedText style={styles.detailCardTitle}>From</ThemedText>
          <ThemedText style={styles.detailCardValue}>{senderInfo.account}</ThemedText>
          <ThemedText style={styles.detailCardValue}>{senderInfo.accountNumber}</ThemedText>
        </View>
        
        {/* To card */}
        <View style={styles.detailCard}>
          <ThemedText style={styles.detailCardTitle}>To</ThemedText>
          <ThemedText style={styles.detailCardValue}>{receiverInfo.bank}</ThemedText>
          <ThemedText style={styles.detailCardValue}>{receiverInfo.accountNumber}</ThemedText>
        </View>
        
        {/* Reference number card */}
        <View style={styles.detailCard}>
          <ThemedText style={styles.detailCardTitle}>Reference number</ThemedText>
          <ThemedText style={styles.detailCardValue}>{referenceNumber}</ThemedText>
        </View>
        
        {/* Service fee card */}
        <View style={styles.detailCard}>
          <ThemedText style={styles.detailCardTitle}>Service fee + Tax</ThemedText>
          <View style={styles.feeContainer}>
            <ThemedText style={styles.feeText}>Rs. 0</ThemedText>
            <ThemedText style={styles.feeEmoji}>🎉</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FF7B7B',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: 30,
  },
  headerContent: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  transactionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  amount: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  transactionParties: {
    alignItems: 'center',
    marginBottom: 8,
  },
  fromText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  toText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  dateTime: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  detailsContainer: {
    padding: 16,
    marginTop: 8,
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  detailCardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailCardValue: {
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  feeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeText: {
    fontSize: 16,
    color: '#00C853',
    marginRight: 4,
  },
  feeEmoji: {
    fontSize: 16,
  },
}); 