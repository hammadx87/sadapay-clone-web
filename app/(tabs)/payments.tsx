import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MY_CARDS = [
  {
    id: 'virtual-1',
    type: 'Virtual Card',
    number: '•••• •••• •••• 5542',
    expiry: '12/28',
    holder: 'MUHAMMAD HAMMAD',
    color: '#1e3c72',
    status: 'Active',
    brand: 'visa'
  },
  {
    id: 'physical-1',
    type: 'Physical Card',
    number: '•••• •••• •••• 8890',
    expiry: '05/27',
    holder: 'MUHAMMAD HAMMAD',
    color: '#000000',
    status: 'Active',
    brand: 'mastercard'
  }
];

export default function PaymentsScreen() {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

  const renderCard = ({ item }: { item: typeof MY_CARDS[0] }) => (
    <View style={styles.cardContainer}>
      <View style={[styles.cardGradient, { backgroundColor: item.color }]}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.cardTypeText}>{item.type}</ThemedText>
          <MaterialCommunityIcons 
            name={item.brand === 'visa' ? 'credit-card' : 'credit-card-outline'} 
            size={40} 
            color="#fff" 
          />
        </View>
        
        <View style={styles.cardChipContainer}>
          <MaterialCommunityIcons name="chip" size={36} color="#FFD700" />
          <MaterialCommunityIcons name="wifi" size={24} color="#fff" style={{ transform: [{ rotate: '90deg' }] }} />
        </View>

        <ThemedText style={styles.cardNumberText}>{item.number}</ThemedText>
        
        <View style={styles.cardFooter}>
          <View>
            <ThemedText style={styles.cardLabel}>CARD HOLDER</ThemedText>
            <ThemedText style={styles.cardValue}>{item.holder}</ThemedText>
          </View>
          <View>
            <ThemedText style={styles.cardLabel}>EXPIRES</ThemedText>
            <ThemedText style={styles.cardValue}>{item.expiry}</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerSpacer} />
      
      <ThemedText style={styles.screenTitle}>My Cards</ThemedText>
      
      <View style={styles.carouselContainer}>
        <FlatList
          data={MY_CARDS}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const x = e.nativeEvent.contentOffset.x;
            setSelectedCardIndex(Math.round(x / width));
          }}
          snapToInterval={width}
          decelerationRate="fast"
        />

        <View style={styles.paginationDots}>
          {MY_CARDS.map((_, i) => (
            <View 
              key={i} 
              style={[styles.dot, selectedCardIndex === i && styles.activeDot]} 
            />
          ))}
        </View>
      </View>

      <ThemedView style={styles.cardControlsContainer}>
        <ThemedText style={styles.sectionTitle}>Card Controls</ThemedText>
        
        <View style={styles.controlsGrid}>
          <TouchableOpacity style={styles.controlItem}>
            <View style={[styles.controlIcon, { backgroundColor: '#E3F2FD' }]}>
              <MaterialCommunityIcons name="snowflake" size={24} color="#2196F3" />
            </View>
            <ThemedText style={styles.controlLabel}>Freeze Card</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlItem}>
            <View style={[styles.controlIcon, { backgroundColor: '#F3E5F5' }]}>
              <MaterialCommunityIcons name="eye-outline" size={24} color="#9C27B0" />
            </View>
            <ThemedText style={styles.controlLabel}>View Details</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlItem}>
            <View style={[styles.controlIcon, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons name="lock-reset" size={24} color="#FF9800" />
            </View>
            <ThemedText style={styles.controlLabel}>Change PIN</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlItem}>
            <View style={[styles.controlIcon, { backgroundColor: '#FFEBEE' }]}>
              <MaterialCommunityIcons name="shield-check-outline" size={24} color="#F44336" />
            </View>
            <ThemedText style={styles.controlLabel}>Usage Limits</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      <ThemedView style={styles.settingsContainer}>
        <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
        
        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingIconLabel}>
            <MaterialCommunityIcons name="bell-outline" size={22} color="#666" />
            <ThemedText style={styles.settingText}>Transaction Notifications</ThemedText>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingIconLabel}>
            <MaterialCommunityIcons name="google" size={22} color="#666" />
            <ThemedText style={styles.settingText}>Add to Google Pay</ThemedText>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
      </ThemedView>

      <TouchableOpacity style={styles.orderButton}>
        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        <ThemedText style={styles.orderButtonText}>Order New Physical Card</ThemedText>
      </TouchableOpacity>
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSpacer: {
    height: 60,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 25,
  },
  carouselContainer: {
    marginBottom: 30,
  },
  cardContainer: {
    width: width,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  cardGradient: {
    width: width - 40,
    height: 210,
    borderRadius: 20,
    padding: 24,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTypeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  cardChipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardNumberText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    color: '#fff',
    fontSize: 10,
    opacity: 0.7,
    marginBottom: 4,
  },
  cardValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: '#1e3c72',
    width: 24,
  },
  cardControlsContainer: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  controlsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  controlItem: {
    width: '47%',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
  },
  controlIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  settingsContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 15,
    fontWeight: '500',
  },
  orderButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    marginHorizontal: 20,
    marginTop: 30,
    padding: 20,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
