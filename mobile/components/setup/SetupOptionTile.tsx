import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface Props {
  label: string;
  icon?: IoniconName;
  iconColor?: string;
  iconBg?: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}

export function SetupOptionTile({ label, icon, iconColor, iconBg, description, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`border-2 rounded-2xl p-4 mb-3 flex-row items-center gap-4 ${
        selected ? 'border-primary bg-primary-light' : 'border-gray-200 bg-surface'
      }`}
    >
      {icon && (
        <View
          className="w-12 h-12 rounded-xl items-center justify-center"
          style={{ backgroundColor: selected ? '#2563eb' : iconBg ?? '#f3f4f6' }}
        >
          <Ionicons name={icon} size={22} color={selected ? '#ffffff' : iconColor ?? '#6b7280'} />
        </View>
      )}
      <View className="flex-1">
        <Text className={`text-base font-semibold ${selected ? 'text-primary' : 'text-text-main'}`}>
          {label}
        </Text>
        {description && (
          <Text className="text-text-muted text-sm mt-0.5">{description}</Text>
        )}
      </View>
      {selected && <Ionicons name="checkmark-circle" size={22} color="#2563eb" />}
    </TouchableOpacity>
  );
}
