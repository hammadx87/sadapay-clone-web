import { StyleSheet, View, TouchableOpacity, Platform, StatusBar, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import TransactionService from '../services/TransactionService';
import { getBankById } from '../constants/Banks';

import { STATIC_SENDER } from '../constants/User';

export default function DoneReceiptScreen() {
  const router = useRouter();
  const { amount, recipientName, accountInfo, referenceNumber, bankLogo } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const selectedBank = getBankById(bankLogo as string);
  
  // Get current date and time
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { 
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  // Use the reference number passed from previous screen or generate a fallback
  const refNumber = referenceNumber && referenceNumber !== 'NaN' 
    ? (referenceNumber as string) 
    : ('Raast-' + Math.floor(1000000000 + Math.random() * 9000000000).toString());

  // Format amount with commas
  const formattedAmount = Number(amount).toLocaleString('en-IN');
  
  return (
    <>
      <StatusBar backgroundColor="#F5F7FA" barStyle="dark-content" />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft} />
          <View style={styles.headerCenter}>
            <View style={styles.logoContainer}>
              <View style={styles.sadapayIcon}>
                <View style={[styles.sadapayCircle, { backgroundColor: '#02DCB9', transform: [{ translateX: -4 }] }]} />
                <View style={[styles.sadapayCircle, { backgroundColor: '#FF7B7B', transform: [{ translateX: 4 }] }]} />
              </View>
              <ThemedText style={styles.logoText}>SADAPAY</ThemedText>
            </View>
          </View>
          <TouchableOpacity style={styles.headerRight}>
            <ThemedText style={styles.shareButton}>Share</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.successCircle}>
            <MaterialCommunityIcons name="check" size={32} color="#fff" />
          </View>

          <View style={styles.receiptCard}>
            <View style={styles.centeredContent}>
              <ThemedText style={styles.amount}>Rs. {formattedAmount}</ThemedText>
              <View style={styles.recipientContainer}>
                <ThemedText style={styles.senderToText}>{STATIC_SENDER.name} to</ThemedText>
                <ThemedText style={styles.recipientNameText}>{recipientName}</ThemedText>
              </View>

              <View style={styles.poweredBy}>
                <ThemedText style={styles.poweredByText}>Powered by</ThemedText>
                <Image 
                  source={require('../assets/images/raast-logo.png')}
                  style={styles.raastLogo}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={styles.detailsSection}>
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Date & Time (PKT)</ThemedText>
                <ThemedText style={styles.detailValue}>{dateStr}, {timeStr}</ThemedText>
              </View>

              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Receiver's Account</ThemedText>
                <ThemedText style={styles.detailValue}>{selectedBank.name} {accountInfo}</ThemedText>
              </View>

              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Reference Number</ThemedText>
                <ThemedText style={styles.detailValue}>{refNumber}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => {
              router.replace('/(tabs)');
            }}
          >
            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
            <MaterialCommunityIcons name="close" size={24} color="#fff" style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  headerLeft: {
    width: 60,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sadapayIcon: {
    width: 24,
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sadapayCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: 'absolute',
    opacity: 0.8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a3c40',
    letterSpacing: 1,
  },
  shareButton: {
    color: '#FF7B7B',
    fontSize: 16,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF7B7B',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginTop: -32,
    paddingTop: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  centeredContent: {
    alignItems: 'center',
    marginBottom: 24,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a3c40',
    marginBottom: 8,
  },
  recipientContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  senderToText: {
    fontSize: 14,
    color: '#1a3c40',
    fontWeight: '500',
    textAlign: 'center', 
  },
  recipientNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a3c40',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  poweredBy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    opacity: 0.6,
  },
  poweredByText: {
    fontSize: 11,
    color: '#666',
  },
  raastLogo: {
    width: 32,
    height: 12,
    marginLeft: 2,
  },
  detailsSection: {
    gap: 16,
  },
  detailItem: {
    gap: 2,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1a3c40',
    fontWeight: 'bold',
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  closeButton: {
    backgroundColor: '#FF7B7B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeIcon: {
    marginLeft: 8,
  },
});