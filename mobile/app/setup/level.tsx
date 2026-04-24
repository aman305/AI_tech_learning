import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSetupStore } from '../../stores/useSetupStore';
import { useSessionStore } from '../../stores/useSessionStore';
import { SetupOptionTile } from '../../components/setup/SetupOptionTile';
import { Level } from '../../types';

const levels: { label: Level; icon: 'leaf' | 'rocket' | 'flash'; description: string }[] = [
  { label: 'Beginner', icon: 'leaf', description: 'New to this technology, start from scratch' },
  { label: 'Intermediate', icon: 'rocket', description: 'Know the basics, want to go deeper' },
  { label: 'Advanced', icon: 'flash', description: 'Experienced, focus on edge cases and best practices' },
];

export default function SetupLevelScreen() {
  const level = useSetupStore((s) => s.level);
  const setLevel = useSetupStore((s) => s.setLevel);
  const getSetup = useSetupStore((s) => s.getSetup);
  const reset = useSetupStore((s) => s.reset);
  const createSession = useSessionStore((s) => s.createSession);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    const setup = getSetup();
    if (!setup) { Alert.alert('Error', 'Please complete all steps'); return; }
    setLoading(true);
    try {
      const session = createSession(setup);
      reset();
      router.replace(`/chat/${session.id}`);
    } catch {
      Alert.alert('Error', 'Could not start session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-6 pt-16" showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} className="mb-6">
          <Text className="text-primary text-base">← Back</Text>
        </TouchableOpacity>

        <View className="mb-2">
          <Text className="text-text-muted text-sm font-medium">Step 3 of 3</Text>
          <View className="flex-row gap-1 mt-2 mb-6">
            {[0,1,2].map(i => (
              <View key={i} className="h-1 flex-1 rounded-full bg-primary" />
            ))}
          </View>
        </View>

        <Text className="text-text-main text-2xl font-bold mb-2">What's your level?</Text>
        <Text className="text-text-muted text-base mb-8">Your current experience with this technology</Text>

        {levels.map(({ label, icon, description }) => (
          <SetupOptionTile
            key={label}
            label={label}
            icon={icon}
            description={description}
            selected={level === label}
            onPress={() => setLevel(label)}
          />
        ))}
      </ScrollView>

      <View className="px-6 pb-10 pt-4">
        <TouchableOpacity
          onPress={handleStart}
          disabled={!level || loading}
          className={`rounded-2xl py-4 items-center ${level && !loading ? 'bg-primary' : 'bg-gray-300'}`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-lg">
            {loading ? 'Starting...' : 'Start Learning'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
