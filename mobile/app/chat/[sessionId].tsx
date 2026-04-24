import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, FlatList, KeyboardAvoidingView, Platform,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useChatStore } from '../../stores/useChatStore';
import { useSessionStore } from '../../stores/useSessionStore';
import { ChatBubble } from '../../components/chat/ChatBubble';
import { TypingIndicator } from '../../components/chat/TypingIndicator';
import { LessonLockBanner } from '../../components/chat/LessonLockBanner';
import { CommandBar } from '../../components/chat/CommandBar';
import { MessageInput } from '../../components/chat/MessageInput';
import { Message, CommandType } from '../../types';

export default function ChatScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const sessions = useSessionStore((s) => s.sessions);
  const session = sessions.find((s) => s.id === sessionId);

  const messages = useChatStore((s) => s.messagesBySession[sessionId] ?? []);
  const isLoading = useChatStore((s) => s.isLoading);
  const loadMessages = useChatStore((s) => s.loadMessages);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const initGreeting = useChatStore((s) => s.initGreeting);
  const didInitRef = useRef(false);

  const prevAwaitingRef = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (!sessionId) return;
    loadMessages(sessionId);
  }, [sessionId]);

  // Auto-trigger greeting from server on first entry (invisible "hi" trigger)
  useEffect(() => {
    if (!session || !sessionId) return;
    if (didInitRef.current) return;
    if (messages.length === 0) {
      didInitRef.current = true;
      initGreeting(sessionId, session.setup);
    }
  }, [session, sessionId, messages.length]);

  // Haptic feedback when awaitingAnswer changes
  useEffect(() => {
    if (!session) return;
    const prev = prevAwaitingRef.current;
    const curr = session.awaitingAnswer;
    if (prev === undefined) { prevAwaitingRef.current = curr; return; }
    if (!prev && curr) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (prev && !curr) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    prevAwaitingRef.current = curr;
  }, [session?.awaitingAnswer]);

  const handleSend = useCallback(async (text?: string) => {
    const msg = (text ?? inputText).trim();
    if (!msg || !session) return;
    setInputText('');
    try {
      await sendMessage(sessionId, msg, session.setup);
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [inputText, session, sessionId]);

  const handleCommand = useCallback((cmd: CommandType) => {
    if (cmd === 'next' && session?.awaitingAnswer) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleSend(cmd);
  }, [handleSend, session?.awaitingAnswer]);

  const curriculum = session?.curriculum ?? [];
  const currentLesson = session?.currentLesson ?? 0;
  const awaitingAnswer = session?.awaitingAnswer ?? false;
  const topicName = session?.setup?.technology ?? 'Chat';
  const progress = curriculum.length > 0
    ? `Lesson ${Math.min(currentLesson + 1, curriculum.length)}/${curriculum.length}`
    : '';

  const renderItem = ({ item }: { item: Message }) => <ChatBubble message={item} />;

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-surface border-b border-gray-100 gap-3">
        <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 items-center justify-center">
          <Ionicons name="chevron-back" size={24} color="#2563eb" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-text-main font-bold text-base" numberOfLines={1}>{topicName}</Text>
          {progress ? (
            <Text className="text-text-muted text-xs">{progress} • {session?.setup?.level}</Text>
          ) : null}
        </View>
        {curriculum.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push(`/chat/curriculum?sessionId=${sessionId}`)}
            className="bg-primary-light rounded-xl px-3 py-1.5 flex-row items-center gap-1.5"
          >
            <Ionicons name="list" size={14} color="#2563eb" />
            <Text className="text-primary text-sm font-medium">Topics</Text>
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 12 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListFooterComponent={isLoading ? <TypingIndicator /> : null}
          showsVerticalScrollIndicator={false}
        />

        {/* Lesson lock banner */}
        {awaitingAnswer && <LessonLockBanner />}

        {/* Command bar */}
        <CommandBar
          onCommand={handleCommand}
          awaitingAnswer={awaitingAnswer}
          disabled={isLoading}
        />

        {/* Input */}
        <MessageInput
          value={inputText}
          onChangeText={setInputText}
          onSend={() => handleSend()}
          loading={isLoading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
