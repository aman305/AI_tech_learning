import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useSessionStore } from '../../../stores/useSessionStore';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const sessions = useSessionStore((s) => s.sessions);

  const recentSession = sessions[0];
  const totalCompleted = sessions.reduce((sum, s) => sum + s.currentLesson, 0);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-8">
          <Text className="text-text-muted text-sm">Good day 👋</Text>
          <Text className="text-text-main text-2xl font-bold mt-1">
            {user?.name?.split(' ')[0] ?? 'Learner'}
          </Text>
        </View>

        {/* Stats row */}
        <View className="flex-row gap-3 mb-8">
          <View className="flex-1 bg-primary rounded-2xl p-4">
            <Text className="text-white text-3xl font-bold">{sessions.length}</Text>
            <Text className="text-blue-200 text-sm mt-1">Active Topics</Text>
          </View>
          <View className="flex-1 bg-success rounded-2xl p-4">
            <Text className="text-white text-3xl font-bold">{totalCompleted}</Text>
            <Text className="text-green-100 text-sm mt-1">Lessons Done</Text>
          </View>
        </View>

        {/* Continue learning */}
        {recentSession && (
          <View className="mb-6">
            <Text className="text-text-main font-bold text-base mb-3">Continue Learning</Text>
            <TouchableOpacity
              onPress={() => router.push(`/chat/${recentSession.id}`)}
              activeOpacity={0.85}
              className="bg-surface rounded-2xl p-5 shadow-sm"
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="bg-primary-light rounded-xl px-3 py-1.5">
                  <Text className="text-primary font-semibold text-sm">
                    {recentSession.setup.technology}
                  </Text>
                </View>
                <Text className="text-text-muted text-xs">{recentSession.setup.level}</Text>
              </View>
              <Text className="text-text-main font-semibold text-base mb-2">
                {recentSession.curriculum[recentSession.currentLesson] ?? 'Starting...'}
              </Text>
              {recentSession.curriculum.length > 0 && (
                <View>
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-text-muted text-xs">Progress</Text>
                    <Text className="text-text-muted text-xs">
                      {recentSession.currentLesson}/{recentSession.curriculum.length} topics
                    </Text>
                  </View>
                  <View className="h-1.5 bg-gray-100 rounded-full">
                    <View
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(recentSession.currentLesson / recentSession.curriculum.length) * 100}%` }}
                    />
                  </View>
                </View>
              )}
              <View className="flex-row items-center justify-end mt-4">
                <Text className="text-primary font-semibold text-sm">Continue →</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Start new */}
        <View className="mb-8">
          <Text className="text-text-main font-bold text-base mb-3">Start Something New</Text>
          <TouchableOpacity
            onPress={() => router.push('/setup')}
            className="bg-primary rounded-2xl py-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">+ New Learning Session</Text>
          </TouchableOpacity>
        </View>

        {/* Empty state */}
        {sessions.length === 0 && (
          <View className="items-center py-8">
            <Text className="text-5xl mb-4">🎓</Text>
            <Text className="text-text-main font-bold text-lg mb-2">Ready to learn?</Text>
            <Text className="text-text-muted text-center text-sm">
              Start your first AI-powered lesson. Pick a technology and let the AI tutor guide you.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
