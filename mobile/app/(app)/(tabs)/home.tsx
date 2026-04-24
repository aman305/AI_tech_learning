import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useSessionStore } from '../../../stores/useSessionStore';
import { useSetupStore } from '../../../stores/useSetupStore';
import { fieldIcons, fieldIconColors } from '../../../constants/techOptions';
import { Field } from '../../../types';

const categories: { field: Field; description: string }[] = [
  { field: 'Software Development', description: 'Python, JS, React, Flutter & more' },
  { field: 'QA', description: 'Selenium, Cypress, Playwright' },
  { field: 'Data & AI', description: 'ML, TensorFlow, SQL, Pandas' },
  { field: 'DevOps', description: 'Docker, Kubernetes, AWS, CI/CD' },
];

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const sessions = useSessionStore((s) => s.sessions);
  const setField = useSetupStore((s) => s.setField);

  const recentSession = sessions[0];
  const totalCompleted = sessions.reduce((sum, s) => sum + s.currentLesson, 0);

  const handleCategoryPress = (field: Field) => {
    setField(field);
    router.push('/setup/technology');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-text-muted text-sm">Good day</Text>
          <Text className="text-text-main text-2xl font-bold mt-1">
            {user?.name?.split(' ')[0] ?? 'Learner'}
          </Text>
        </View>

        {/* Stats row */}
        <View className="flex-row gap-3 mb-8">
          <View className="flex-1 bg-primary rounded-2xl p-4">
            <Text className="text-white text-3xl font-bold">{sessions.length}</Text>
            <Text className="text-blue-100 text-sm mt-1">Active Topics</Text>
          </View>
          <View className="flex-1 bg-success rounded-2xl p-4">
            <Text className="text-white text-3xl font-bold">{totalCompleted}</Text>
            <Text className="text-green-50 text-sm mt-1">Lessons Done</Text>
          </View>
        </View>

        {/* Continue learning */}
        {recentSession && (
          <View className="mb-8">
            <Text className="text-text-main font-bold text-base mb-3">Continue Learning</Text>
            <TouchableOpacity
              onPress={() => router.push(`/chat/${recentSession.id}`)}
              activeOpacity={0.85}
              className="bg-surface rounded-2xl p-5"
              style={{
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="bg-primary-light rounded-xl px-3 py-1.5">
                  <Text className="text-primary font-semibold text-sm">
                    {recentSession.setup.technology}
                  </Text>
                </View>
                <Text className="text-text-muted text-xs">{recentSession.setup.level}</Text>
              </View>
              <Text className="text-text-main font-semibold text-base mb-3" numberOfLines={2}>
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
                  <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
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

        {/* Category tiles */}
        <View className="mb-8">
          <Text className="text-text-main font-bold text-base mb-1">
            {sessions.length > 0 ? 'Explore New Topics' : 'Pick a topic to start'}
          </Text>
          <Text className="text-text-muted text-sm mb-4">
            Choose a category to begin a new AI-guided lesson
          </Text>

          <View className="flex-row flex-wrap -mx-1.5">
            {categories.map(({ field, description }) => {
              const colors = fieldIconColors[field];
              return (
                <View key={field} className="w-1/2 px-1.5 mb-3">
                  <TouchableOpacity
                    onPress={() => handleCategoryPress(field)}
                    activeOpacity={0.8}
                    className="bg-surface rounded-2xl p-4 min-h-[160px]"
                    style={{
                      shadowColor: '#000',
                      shadowOpacity: 0.04,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 2 },
                      elevation: 1,
                    }}
                  >
                    <View
                      className="w-12 h-12 rounded-xl items-center justify-center mb-3"
                      style={{ backgroundColor: colors.bg }}
                    >
                      <Ionicons name={fieldIcons[field]} size={22} color={colors.fg} />
                    </View>
                    <Text className="text-text-main font-bold text-base mb-1">{field}</Text>
                    <Text className="text-text-muted text-xs leading-4">{description}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* Empty state nudge */}
        {sessions.length === 0 && (
          <View className="items-center py-4 px-4">
            <Text className="text-text-muted text-center text-sm">
              Tap a category above to start your first AI-powered lesson.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
