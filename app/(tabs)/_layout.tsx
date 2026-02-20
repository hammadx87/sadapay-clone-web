import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme, Platform, View } from 'react-native';
import Colors from '../../constants/Colors';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.background,
            height: Platform.OS === 'ios' ? 85 : 65,
            borderTopWidth: 1,
            borderTopColor: '#E5E5E5',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            shadowOpacity: 0,
            paddingTop: 5,
            paddingBottom: Platform.OS === 'ios' ? 25 : 5,
          },
          tabBarActiveTintColor: '#FF7B7B',
          tabBarInactiveTintColor: '#999999',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" size={24} color={color === '#FF7B7B' ? '#FF7B7B' : '#999999'} />
            ),
          }}
        />
        <Tabs.Screen
          name="payments"
          options={{
            title: 'Payments',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="wallet-outline" size={24} color={color === '#FF7B7B' ? '#FF7B7B' : '#999999'} />
            ),
          }}
        />
        <Tabs.Screen
          name="scan"
          options={{
            title: 'Scan QR',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="qrcode-scan" size={24} color={color === '#FF7B7B' ? '#FF7B7B' : '#999999'} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'More',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="menu" size={24} color={color === '#FF7B7B' ? '#FF7B7B' : '#999999'} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
