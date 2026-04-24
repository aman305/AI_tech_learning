import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSessionStore } from '../../stores/useSessionStore';
import { useChatStore } from '../../stores/useChatStore';
import { CurriculumItem } from '../../components/curriculum/CurriculumItem';
import { ProgressBar } from '../../components/curriculum/ProgressBar';

export default function CurriculumScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const sessions = useSessionStore((s) => s.sessions);
  const session = sessions.find((s) => s.id === sessionId);
  const sendMessage = useChatStore((s) => s.sendMessage);

  if (!session) return null;

  const { curriculum, currentLesson, awaitingAnswer, setup } = session;
  const completedCount = currentLesson;

  const handleJump = async (index: number) => {
    if (index > currentLesson) {
      Alert.alert('Locked', 'Complete the current lesson to unlock this topic.');
      return;
    }
    if (awaitingAnswer && index !== currentLesson) {
      Alert.alert('Answer Required', 'Please answer the current question before jumping.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
    await sendMessage(sessionId, `jump-to:${index}`, setup);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-row items-center px-4 py-4 border-b border-gray-100 bg-surface gap-3">
        <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 items-center justify-center">
          <Ionicons name="close" size={24} color="#2563eb" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-text-main font-bold text-lg">{setup.technology}</Text>
          <Text className="text-text-muted text-sm">{setup.level} • {setup.mode}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <ProgressBar current={completedCount} total={curriculum.length} />
        </View>

        <Text className="text-text-muted text-sm font-medium mb-3">CURRICULUM</Text>

        {curriculum.length === 0 ? (
          <View className="items-center py-12">
            <Ionicons name="library-outline" size={40} color="#9ca3af" />
            <Text className="text-text-muted text-center mt-3">
              Curriculum will load when you start the first lesson.
            </Text>
          </View>
        ) : (
          curriculum.map((topic, i) => {
            const status = i < currentLesson ? 'done' : i === currentLesson ? 'active' : 'locked';
            return (
              <CurriculumItem
                key={i}
                index={i}
                title={topic}
                status={status}
                onPress={() => handleJump(i)}
              />
            );
          })
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
