import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#2563eb', '#4f46e5']} className="flex-1 px-6 pt-24 pb-12 justify-between">
        <View className="flex-1 justify-center items-center">
          <View className="w-20 h-20 bg-white/20 rounded-2xl items-center justify-center mb-6">
            <Ionicons name="school" size={44} color="#ffffff" />
          </View>
          <Text className="text-white text-4xl font-bold text-center mb-3">
            AI Mentor Hub
          </Text>
          <Text className="text-blue-100 text-lg text-center mb-10">
            Your personal AI-powered coding tutor
          </Text>

          <View className="gap-3 w-full">
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center">
                <Ionicons name="checkmark" size={16} color="#ffffff" />
              </View>
              <Text className="text-blue-100 text-base">Adaptive AI curriculum for any tech</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center">
                <Ionicons name="checkmark" size={16} color="#ffffff" />
              </View>
              <Text className="text-blue-100 text-base">Socratic question-driven learning</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center">
                <Ionicons name="checkmark" size={16} color="#ffffff" />
              </View>
              <Text className="text-blue-100 text-base">Track progress across all topics</Text>
            </View>
          </View>
        </View>

        <View className="gap-4">
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            className="bg-white rounded-2xl py-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-primary font-bold text-lg">Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            className="border border-white/40 rounded-2xl py-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-lg">Log In</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
