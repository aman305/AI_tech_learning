import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Session } from '../../types';
import { fieldIcons, fieldIconColors } from '../../constants/techOptions';

interface Props {
  session: Session;
  onPress: () => void;
  onDelete: () => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function SessionCard({ session, onPress, onDelete }: Props) {
  const { setup, curriculum, currentLesson, awaitingAnswer, updatedAt } = session;
  const icon = fieldIcons[setup.field];
  const colors = fieldIconColors[setup.field];
  const hasProgress = curriculum.length > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-surface rounded-2xl p-4 mb-3 mx-4"
    >
      <View className="flex-row items-start gap-3">
        <View
          className="w-12 h-12 rounded-xl items-center justify-center"
          style={{ backgroundColor: colors.bg }}
        >
          <Ionicons name={icon} size={22} color={colors.fg} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-text-main font-bold text-base flex-1 mr-2" numberOfLines={1}>
              {setup.technology}
            </Text>
            <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Ionicons name="trash-outline" size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          <Text className="text-text-muted text-xs mt-0.5 mb-2">
            {setup.level} • {setup.mode}
          </Text>

          {hasProgress ? (
            <View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-text-muted text-xs">
                  {currentLesson}/{curriculum.length} lessons
                </Text>
                {awaitingAnswer && (
                  <View className="bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                    <Text className="text-error text-xs">Answer pending</Text>
                  </View>
                )}
              </View>
              <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(currentLesson / curriculum.length) * 100}%` }}
                />
              </View>
            </View>
          ) : (
            <Text className="text-text-muted text-xs">Not started yet</Text>
          )}
        </View>
      </View>
      <Text className="text-text-muted text-xs text-right mt-2">{timeAgo(updatedAt)}</Text>
    </TouchableOpacity>
  );
}
