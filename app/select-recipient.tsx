import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Platform, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

type Recipient = {
  id: string;
  name: string;
  accountInfo: string;
  bankName: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  backgroundColor: string;
  logo?: any;
};

const RECIPIENTS: Recipient[] = [
  {
    id: '1',
    name: 'Muhammad Hammad',
    accountInfo: 'NayaPay *6497',
    bankName: 'NayaPay',
    iconName: 'bank',
    iconColor: '#FF4444',
    backgroundColor: '#FFE5E5',
    logo: require('../assets/images/nayapay.png')
  },
  {
    id: '2',
    name: 'MUHAMMAD HAMMAD',
    accountInfo: 'JazzCash *6497',
    bankName: 'JazzCash',
    iconName: 'lightning-bolt',
    iconColor: '#FFB800',
    backgroundColor: '#FFF9E5',
    logo: require('../assets/images/jazzcash.png')
  },
  {
    id: '3',
    name: 'USAMA AKRAM',
    accountInfo: 'Meezan Bank (MBL) *9230',
    bankName: 'Meezan Bank',
    iconName: 'bank',
    iconColor: '#00B27D',
    backgroundColor: '#E5FFF7'
  },
  {
    id: '4',
    name: 'ASAD HUSSAIN',
    accountInfo: 'Easypaisa *3596',
    bankName: 'Easypaisa',
    iconName: 'bank-transfer',
    iconColor: '#2196F3',
    backgroundColor: '#E5F6FF',
    logo: require('../assets/images/easypaisa.png')
  },
  {
    id: '5',
    name: 'M.KAMRAN ABBASI',
    accountInfo: 'HBL *3456',
    bankName: 'Habib Bank Limited',
    iconName: 'bank',
    iconColor: '#FFA000',
    backgroundColor: '#FFF5E5'
  },
  {
    id: '6',
    name: 'Adul Aleem',
    accountInfo: 'Easypaisa *3596',
    bankName: 'Easypaisa',
    iconName: 'bank-transfer',
    iconColor: '#2196F3',
    backgroundColor: '#E5F6FF',
    logo: require('../assets/images/easypaisa.png')
  }
];

export default function SelectRecipientScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { amount } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const handleRecipientSelect = (recipient: Recipient) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    router.push({
      pathname: "/confirm-payment" as const,
      params: { 
        amount,
        recipientId: recipient.id,
        recipientName: recipient.name,
        accountInfo: recipient.accountInfo
      }
    });

    // Reset processing state after a short delay to allow navigation
    setTimeout(() => setIsProcessing(false), 1000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            onPress={() => !isProcessing && router.back()} 
            style={styles.headerLeft}
            disabled={isProcessing}
          >
            <MaterialCommunityIcons name="chevron-left" size={32} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <ThemedText style={styles.title}>Send money</ThemedText>
          </View>
          <TouchableOpacity 
            onPress={() => !isProcessing && router.push({ pathname: "/add-recipient", params: { amount } })}
            style={styles.headerRight}
            disabled={isProcessing}
          >
            <MaterialCommunityIcons name="plus" size={32} color="#FF7B7B" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={24} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Enter IBAN, Raast ID, account or name"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>
      </View>

      <View style={styles.recipientsSection}>
        <ThemedText style={styles.sectionTitle}>RECIPIENTS</ThemedText>
        <ScrollView style={styles.recipientsList}>
          {RECIPIENTS.map((recipient) => (
            <TouchableOpacity 
              key={recipient.id} 
              style={styles.recipientItem}
              onPress={() => handleRecipientSelect(recipient)}
            >
              <View style={[styles.recipientIcon, { backgroundColor: recipient.logo ? '#fff' : recipient.backgroundColor }]}>
                {recipient.logo ? (
                  <Image 
                    source={recipient.logo} 
                    style={styles.bankLogo} 
                    resizeMode="cover"
                  />
                ) : (
                  <MaterialCommunityIcons 
                    name={recipient.iconName} 
                    size={20} 
                    color={recipient.iconColor}
                  />
                )}
              </View>
              <View style={styles.recipientInfo}>
                <ThemedText style={styles.recipientName}>{recipient.name}</ThemedText>
                <ThemedText style={styles.recipientAccount}>{recipient.accountInfo}</ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    marginBottom: 8,
  },
  headerLeft: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  helpText: {
    color: '#FF7B7B',
    fontSize: 16,
  },
  searchContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#000',
  },
  recipientsSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  recipientsList: {
    flex: 1,
  },
  recipientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  recipientIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  bankLogo: {
    width: '100%',
    height: '100%',
  },
  recipientInfo: {
    marginLeft: 16,
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  recipientAccount: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
}); 