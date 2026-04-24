import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../stores/useAuthStore';
import { useSessionStore } from '../../stores/useSessionStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      useSessionStore.getState().loadFromDB();
      router.replace('/(app)/(tabs)/home');
    } catch (e: any) {
      Alert.alert('Login Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-bg"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-6 pt-16 pb-8">
          <TouchableOpacity onPress={() => router.back()} className="mb-8">
            <Text className="text-primary text-base">← Back</Text>
          </TouchableOpacity>

          <Text className="text-text-main text-3xl font-bold mb-2">Welcome back</Text>
          <Text className="text-text-muted text-base mb-10">Log in to continue learning</Text>

          <View className="gap-4">
            <View>
              <Text className="text-text-main text-sm font-medium mb-2">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholder="you@example.com"
                placeholderTextColor="#9ca3af"
                className="bg-surface border border-gray-200 rounded-xl px-4 py-4 text-text-main text-base"
              />
            </View>

            <View>
              <Text className="text-text-main text-sm font-medium mb-2">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                className="bg-surface border border-gray-200 rounded-xl px-4 py-4 text-text-main text-base"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="bg-primary rounded-2xl py-4 items-center mt-8"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-lg">
              {loading ? 'Logging in...' : 'Log In'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-text-muted">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-primary font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
