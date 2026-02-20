import { StyleSheet, View, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#F5F7FA' }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileIconContainer}>
            <MaterialCommunityIcons name="account" size={32} color="#00BFA5" />
          </View>
          <ThemedText style={styles.profileName}>Muhammad Hammad</ThemedText>
        </View>

        {/* Business Account Switch */}
        <TouchableOpacity style={styles.businessCard}>
          <View style={styles.businessIconContainer}>
            <MaterialCommunityIcons name="sync" size={24} color="#fff" />
          </View>
          <ThemedText style={styles.businessText}>Switch to Business account</ThemedText>
        </TouchableOpacity>

        {/* Limit Section */}
        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>Limit</ThemedText>
          
          <View style={styles.limitRow}>
            <ThemedText style={styles.limitLabel}>Incoming</ThemedText>
            <ThemedText style={styles.limitValue}>Rs. 400,000 left</ThemedText>
          </View>
          
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          
          <ThemedText style={styles.limitDescription}>
            Your Rs. 400k monthly limit resets on the 1st of next month
          </ThemedText>
        </View>

        {/* Documents Section */}
        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>Documents</ThemedText>
          
          <TouchableOpacity style={styles.documentItem}>
            <View style={styles.documentIconContainer}>
              <MaterialCommunityIcons name="file-document-outline" size={24} color="#FF7B7B" />
            </View>
            <ThemedText style={styles.documentText}>Account Statement</ThemedText>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Discover Section */}
        <View style={styles.discoverSection}>
          <View style={styles.discoverHeader}>
            <ThemedText style={styles.discoverTitle}>Discover</ThemedText>
            <MaterialCommunityIcons name="play-circle-outline" size={24} color="#FF7B7B" />
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.discoverCardsContainer}
          >
            <TouchableOpacity style={styles.discoverCard}>
              <View style={styles.raastIconContainer}>
                <MaterialCommunityIcons name="star-four-points" size={32} color="#FFB800" />
              </View>
              <ThemedText style={styles.discoverCardTitle}>How to use Raast</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.discoverCard}>
              <View style={styles.raastIconContainer}>
                <MaterialCommunityIcons name="bank-transfer" size={32} color="#006A4D" />
              </View>
              <ThemedText style={styles.discoverCardTitle}>What is Raast?</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.discoverCard}>
              <View style={styles.balloonContainer}>
                <MaterialCommunityIcons name="balloon" size={32} color="#FF7B7B" />
              </View>
              <ThemedText style={styles.discoverCardTitle}>Welcome to SadaPay!</ThemedText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 90 : 70,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6F9F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
  },
  businessCard: {
    backgroundColor: '#5D4037',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  businessIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  businessText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  limitLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  limitValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF7B7B',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    width: '90%',
    backgroundColor: '#FF7B7B',
    borderRadius: 4,
  },
  limitDescription: {
    fontSize: 14,
    color: '#999',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFEBEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  documentText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  discoverSection: {
    marginBottom: 16,
  },
  discoverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  discoverTitle: {
    fontSize: 18,
    color: '#666',
    marginRight: 8,
  },
  discoverCardsContainer: {
    paddingRight: 16,
  },
  discoverCard: {
    width: 120,
    height: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    justifyContent: 'space-between',
  },
  raastIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#FFF9E5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  balloonContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#FFEBEB',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  discoverCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 