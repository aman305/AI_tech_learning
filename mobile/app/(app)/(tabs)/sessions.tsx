import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSessionStore } from '../../../stores/useSessionStore';
import { SessionCard } from '../../../components/sessions/SessionCard';
import { Session } from '../../../types';

export default function SessionsScreen() {
  const sessions = useSessionStore((s) => s.sessions);
  const deleteSession = useSessionStore((s) => s.deleteSession);

  const confirmDelete = (session: Session) => {
    Alert.alert(
      'Delete Session',
      `Delete your ${session.setup.technology} session? All chat history will be lost.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteSession(session.id) },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      {/* Header */}
      <View className="px-5 pt-6 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-text-main text-2xl font-bold">Sessions</Text>
          <Text className="text-text-muted text-sm mt-0.5">{sessions.length} active topic{sessions.length !== 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/setup')}
          className="bg-primary rounded-xl px-4 py-2"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-sm">+ New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() => router.push(`/chat/${item.id}`)}
            onDelete={() => confirmDelete(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 4 }}
        ListEmptyComponent={
          <View className="items-center px-8 pt-20">
            <Ionicons name="chatbubbles-outline" size={56} color="#9ca3af" />
            <Text className="text-text-main font-bold text-lg mb-2 text-center mt-4">No sessions yet</Text>
            <Text className="text-text-muted text-center text-sm mb-6">
              Start a new learning session to see it here.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(app)/(tabs)/home')}
              className="bg-primary rounded-2xl px-8 py-3"
            >
              <Text className="text-white font-bold">Browse Topics</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}
