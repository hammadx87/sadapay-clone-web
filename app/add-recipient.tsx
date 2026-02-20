import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Platform, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BANKS } from '../constants/Banks';

export default function AddRecipientScreen() {
  const router = useRouter();
  const { amount } = useLocalSearchParams();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState(BANKS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    if (isProcessing || !fullName || !phoneNumber) return;
    setIsProcessing(true);

    router.push({
      pathname: "/confirm-payment",
      params: {
        amount,
        recipientName: fullName,
        accountInfo: `${selectedBank.name} *${phoneNumber.slice(-4)}`,
        phoneNumber: phoneNumber,
        bankName: selectedBank.name,
        bankLogo: selectedBank.id // Passing ID to help selection in next screens
      }
    });

    // Reset processing state after a short delay to allow navigation
    setTimeout(() => setIsProcessing(false), 1000);
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
          <ThemedText style={styles.title}>Add Recipient</ThemedText>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Full Name</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Phone Number</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="03xx xxxxxxx"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Select Bank</ThemedText>
          <TouchableOpacity 
            style={styles.dropdownHeader} 
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <View style={styles.selectedBankInfo}>
              <Image source={selectedBank.logo} style={styles.bankLogo} resizeMode="contain" />
              <ThemedText style={styles.selectedBankName}>{selectedBank.name}</ThemedText>
            </View>
            <MaterialCommunityIcons 
              name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>

          {isDropdownOpen && (
            <View style={styles.dropdownList}>
              {BANKS.map((bank) => (
                <TouchableOpacity 
                  key={bank.id} 
                  style={styles.bankOption}
                  onPress={() => {
                    setSelectedBank(bank);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Image source={bank.logo} style={styles.bankLogoSmall} resizeMode="contain" />
                  <ThemedText style={styles.bankOptionName}>{bank.name}</ThemedText>
                  {selectedBank.id === bank.id && (
                    <MaterialCommunityIcons name="check" size={20} color="#FF7B7B" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.continueButton, 
            (!fullName || !phoneNumber || isProcessing) && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!fullName || !phoneNumber || isProcessing}
        >
          <ThemedText style={styles.continueButtonText}>
            {isProcessing ? 'Adding...' : 'Continue'}
          </ThemedText>
        </TouchableOpacity>
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
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#FAFAFA',
  },
  dropdownHeader: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
  },
  selectedBankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankLogo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  selectedBankName: {
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  bankLogoSmall: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  bankOptionName: {
    flex: 1,
    fontSize: 15,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  continueButton: {
    backgroundColor: '#FF7B7B',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#FFCACA',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});