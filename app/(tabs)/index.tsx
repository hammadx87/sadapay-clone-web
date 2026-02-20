import { StyleSheet, View, ScrollView, TouchableOpacity, useColorScheme, Platform, Image } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import TransactionService, { TransactionHistoryItem } from '../../services/TransactionService';
import { getBankById } from '../../constants/Banks';

function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  
  // State for balance and transactions
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<TransactionHistoryItem[]>([]);
  
  // Calculate total for today's transactions
  const todayTotal = transactions
    .filter(t => !t.date) // Today's transactions don't have a date field
    .reduce((total, t) => {
      if (t.type === 'received') {
        return total + Number(t.amount.replace(/[^0-9.-]+/g, ''));
      }
      return total;
    }, 0);
    
  // Format the balance with commas
  const formattedBalance = balance.toLocaleString('en-IN');

  // Subscribe to transaction service updates
  useEffect(() => {
    const transactionService = TransactionService.getInstance();
    
    // Initial load
    setBalance(transactionService.getBalance());
    setTransactions(transactionService.getTransactionHistory());
    
    // Subscribe to updates
    const unsubscribe = transactionService.addListener(() => {
      setBalance(transactionService.getBalance());
      setTransactions(transactionService.getTransactionHistory());
    });
    
    // Cleanup subscription
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsContainer}>
          <View>
            <TouchableOpacity style={styles.balanceCard}>
              <ThemedText style={styles.balanceLabel}>Current balance</ThemedText>
              <ThemedText style={styles.balanceAmount}>Rs. {formattedBalance}</ThemedText>

              <View style={styles.cardFooter}>
                <View style={styles.mastercard}>
                  <View style={[styles.mastercardCircle, { backgroundColor: '#FF0000' }]} />
                  <View style={[styles.mastercardCircle, { backgroundColor: '#FF9900', marginLeft: -10 }]} />
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" style={{ opacity: 0.7 }} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.actionCards}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={styles.loadCard}>
                <MaterialCommunityIcons name="arrow-down" size={28} color="#fff" />
                <View style={styles.actionCardText}>
                  <ThemedText style={styles.actionCardTitle}>Load</ThemedText>
                  <ThemedText style={styles.actionCardTitle}>money</ThemedText>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <TouchableOpacity 
                style={styles.sendCard}
                onPress={() => router.push('/send-money')}
              >
                <MaterialCommunityIcons name="arrow-top-right" size={28} color="#fff" />
                <View style={styles.actionCardText}>
                  <ThemedText style={styles.actionCardTitle}>Send &</ThemedText>
                  <ThemedText style={styles.actionCardTitle}>Request</ThemedText>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.transactionsContainer}>
          <View style={styles.dateHeader}>
            <ThemedText style={styles.dateTitle}>Today</ThemedText>
            <ThemedText style={styles.dateAmount}>+ Rs. {todayTotal}</ThemedText>
          </View>

          {transactions.map((transaction, index) => {
            const isNewSection = index > 0 && transaction.date && transactions[index - 1].date !== transaction.date;
            return (
              <View key={transaction.id + (isNewSection ? '_section' : '')}>
                {isNewSection && (
                  <View style={[styles.dateHeader, { marginTop: 32 }]}>
                    <ThemedText style={[styles.dateTitle, { color: '#666' }]}>{transaction.date}</ThemedText>
                    <ThemedText style={[styles.dateAmount, { color: '#666' }]}>- Rs. 385</ThemedText>
                  </View>
                )}
                <TouchableOpacity 
                  style={styles.transactionItem}
                  onPress={() => router.push({
                    pathname: '/transaction-details',
                    params: { id: transaction.id }
                  })}
                >
                  <View style={styles.transactionIconContainer}>
                    <View style={[styles.transactionIcon, { backgroundColor: transaction.type === 'received' ? '#E5FFF7' : '#FFE5E5' }]}>
                      <MaterialCommunityIcons 
                        name={transaction.type === 'received' ? 'arrow-bottom-left' : 'arrow-top-right'} 
                        size={20} 
                        color={transaction.type === 'received' ? '#00B27D' : '#FF4444'}
                      />
                    </View>
                    {transaction.bankId && (
                      <View style={styles.bankLogoBadge}>
                        <Image 
                          source={getBankById(transaction.bankId).logo} 
                          style={styles.bankLogoBadgeImage} 
                          resizeMode="contain"
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.transactionInfo}>
                    <ThemedText style={styles.transactionName}>{transaction.name}</ThemedText>
                    <ThemedText style={styles.transactionTime}>
                      {transaction.type === 'sent' ? `From ${transaction.senderBank || 'SadaPay'} • ` : (transaction.accountInfo ? `${transaction.accountInfo} • ` : '')}{transaction.time}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.transactionAmount, { color: transaction.type === 'received' ? '#00B27D' : theme.text }]}>
                    {transaction.amount}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 90 : 70,
  },
  cardsContainer: {
    padding: 16,
    gap: 16,
  },
  balanceCard: {
    backgroundColor: '#02DCB9',
    borderRadius: 24,
    padding: 24,
    height: 180,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  mastercard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mastercardCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  actionCards: {
    flexDirection: 'row',
    gap: 16,
  },
  loadCard: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: 24,
    padding: 24,
    height: 140,
  },
  sendCard: {
    flex: 1,
    backgroundColor: '#FF7B7B',
    borderRadius: 24,
    padding: 24,
    height: 140,
  },
  actionCardText: {
    marginTop: 'auto',
  },
  actionCardTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 28,
  },
  transactionsContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  dateAmount: {
    fontSize: 16,
    color: '#00B27D',
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  transactionIconContainer: {
    position: 'relative',
    width: 44,
    height: 44,
    marginRight: 12,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankLogoBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bankLogoBadgeImage: {
    width: '100%',
    height: '100%',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionTime: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
