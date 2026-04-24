import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../stores/useAuthStore';
import { useSessionStore } from '../../stores/useSessionStore';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);

  const validate = () => {
    if (!name.trim()) return 'Please enter your name';
    if (!email.trim() || !email.includes('@')) return 'Please enter a valid email';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password !== confirm) return 'Passwords do not match';
    return null;
  };

  const handleRegister = async () => {
    const error = validate();
    if (error) { Alert.alert('Validation Error', error); return; }
    setLoading(true);
    try {
      await register(email.trim().toLowerCase(), password, name.trim());
      useSessionStore.getState().loadFromDB();
      router.replace('/(app)/(tabs)/home');
    } catch (e: any) {
      Alert.alert('Registration Failed', e.message);
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

          <Text className="text-text-main text-3xl font-bold mb-2">Create account</Text>
          <Text className="text-text-muted text-base mb-10">Start your AI learning journey</Text>

          <View className="gap-4">
            {[
              { label: 'Full Name', value: name, set: setName, placeholder: 'John Doe', type: 'default' as const, secure: false },
              { label: 'Email', value: email, set: setEmail, placeholder: 'you@example.com', type: 'email-address' as const, secure: false },
              { label: 'Password', value: password, set: setPassword, placeholder: '••••••••', type: 'default' as const, secure: true },
              { label: 'Confirm Password', value: confirm, set: setConfirm, placeholder: '••••••••', type: 'default' as const, secure: true },
            ].map(({ label, value, set, placeholder, type, secure }) => (
              <View key={label}>
                <Text className="text-text-main text-sm font-medium mb-2">{label}</Text>
                <TextInput
                  value={value}
                  onChangeText={set}
                  keyboardType={type}
                  autoCapitalize={type === 'email-address' ? 'none' : 'words'}
                  secureTextEntry={secure}
                  placeholder={placeholder}
                  placeholderTextColor="#9ca3af"
                  className="bg-surface border border-gray-200 rounded-xl px-4 py-4 text-text-main text-base"
                />
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-primary rounded-2xl py-4 items-center mt-8"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-lg">
              {loading ? 'Creating account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-text-muted">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-primary font-semibold">Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
