import { View, Text } from 'react-native';

interface Props {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: Props) {
  const pct = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  return (
    <View>
      <View className="flex-row justify-between mb-2">
        <Text className="text-text-muted text-sm">{current} of {total} topics done</Text>
        <Text className="text-primary text-sm font-semibold">{Math.round(pct)}%</Text>
      </View>
      <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <View className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
      </View>
    </View>
  );
}
