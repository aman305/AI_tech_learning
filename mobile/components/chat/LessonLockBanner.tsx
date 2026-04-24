import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function LessonLockBanner() {
  return (
    <View className="mx-4 mb-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex-row items-center gap-3">
      <Ionicons name="lock-closed" size={18} color="#ef4444" />
      <View className="flex-1">
        <Text className="text-error font-semibold text-sm">Answer required</Text>
        <Text className="text-red-400 text-xs mt-0.5">Reply to the question above before moving forward</Text>
      </View>
    </View>
  );
}
