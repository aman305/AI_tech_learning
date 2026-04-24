import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useSessionStore } from '../../../stores/useSessionStore';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const sessions = useSessionStore((s) => s.sessions);
  const [notificationsOn, setNotificationsOn] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('notifications_enabled').then((v) => setNotificationsOn(v === 'true'));
  }, []);

  const toggleNotifications = async (val: boolean) => {
    if (val) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Enable notifications in Settings to get study reminders.');
        return;
      }
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time to Learn!',
          body: 'Continue your AI-powered coding lesson.',
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 9, minute: 0 },
      });
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
    setNotificationsOn(val);
    await AsyncStorage.setItem('notifications_enabled', String(val));
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  const totalLessons = sessions.reduce((sum, s) => sum + s.currentLesson, 0);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-text-main text-2xl font-bold mb-6">Profile</Text>

        {/* Avatar + name */}
        <View className="bg-surface rounded-2xl p-5 mb-4 items-center">
          <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-3">
            <Text className="text-white text-3xl font-bold">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text className="text-text-main font-bold text-xl">{user?.name ?? 'Learner'}</Text>
          <Text className="text-text-muted text-sm mt-1">{user?.email ?? ''}</Text>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-surface rounded-2xl p-4 items-center">
            <Text className="text-primary text-2xl font-bold">{sessions.length}</Text>
            <Text className="text-text-muted text-xs mt-1 text-center">Topics</Text>
          </View>
          <View className="flex-1 bg-surface rounded-2xl p-4 items-center">
            <Text className="text-success text-2xl font-bold">{totalLessons}</Text>
            <Text className="text-text-muted text-xs mt-1 text-center">Lessons Done</Text>
          </View>
        </View>

        {/* Settings */}
        <View className="bg-surface rounded-2xl mb-4 overflow-hidden">
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
            <View className="flex-row items-center gap-3">
              <Ionicons name="notifications-outline" size={22} color="#2563eb" />
              <View>
                <Text className="text-text-main font-medium">Daily Reminders</Text>
                <Text className="text-text-muted text-xs">Get notified at 9 AM daily</Text>
              </View>
            </View>
            <Switch
              value={notificationsOn}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#e5e7eb', true: '#2563eb' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* App info */}
        <View className="bg-surface rounded-2xl mb-6 overflow-hidden">
          <View className="px-5 py-4 border-b border-gray-100 flex-row justify-between">
            <Text className="text-text-muted">Version</Text>
            <Text className="text-text-main">1.0.0</Text>
          </View>
          <View className="px-5 py-4 flex-row justify-between">
            <Text className="text-text-muted">Powered by</Text>
            <Text className="text-text-main">Azure OpenAI (GPT-4)</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-50 border border-red-200 rounded-2xl py-4 items-center mb-8"
          activeOpacity={0.8}
        >
          <Text className="text-error font-semibold text-base">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
