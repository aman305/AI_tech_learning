import { useRef } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  onSend: () => void;
  loading: boolean;
}

export function MessageInput({ value, onChangeText, onSend, loading }: Props) {
  const inputRef = useRef<TextInput>(null);
  const canSend = !loading && value.trim().length > 0;

  return (
    <View className="flex-row items-end gap-3 px-4 py-3 bg-surface border-t border-gray-100">
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type your answer..."
        placeholderTextColor="#9ca3af"
        multiline
        maxLength={1000}
        className="flex-1 bg-bg border border-gray-200 rounded-2xl px-4 py-3 text-text-main text-base"
        style={{ maxHeight: 120 }}
      />
      <TouchableOpacity
        onPress={onSend}
        disabled={!canSend}
        activeOpacity={0.8}
        className={`w-11 h-11 rounded-full items-center justify-center ${
          canSend ? 'bg-primary' : 'bg-gray-200'
        }`}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Ionicons name="arrow-up" size={20} color={canSend ? '#ffffff' : '#9ca3af'} />
        )}
      </TouchableOpacity>
    </View>
  );
}
