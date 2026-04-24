import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Status = 'done' | 'active' | 'locked';

interface Props {
  index: number;
  title: string;
  status: Status;
  onPress: () => void;
}

export function CurriculumItem({ index, title, status, onPress }: Props) {
  const isLocked = status === 'locked';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.7}
      className={`flex-row items-center gap-3 p-4 rounded-xl mb-2 border-l-4 ${
        status === 'active'
          ? 'border-primary bg-primary-light'
          : status === 'done'
          ? 'border-success bg-green-50'
          : 'border-gray-200 bg-surface'
      }`}
    >
      <View className={`w-8 h-8 rounded-full items-center justify-center ${
        status === 'done' ? 'bg-success' : status === 'active' ? 'bg-primary' : 'bg-gray-200'
      }`}>
        {status === 'done' ? (
          <Ionicons name="checkmark" size={16} color="#ffffff" />
        ) : (
          <Text className="text-white text-sm font-bold">{String(index + 1)}</Text>
        )}
      </View>
      <Text
        className={`flex-1 text-base font-medium ${
          status === 'active' ? 'text-primary' : status === 'done' ? 'text-success' : 'text-text-muted'
        }`}
        numberOfLines={2}
      >
        {title}
      </Text>
      {isLocked && <Ionicons name="lock-closed" size={16} color="#9ca3af" />}
      {status === 'active' && <Ionicons name="play" size={14} color="#2563eb" />}
    </TouchableOpacity>
  );
}
