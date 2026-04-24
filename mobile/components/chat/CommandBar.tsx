import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { CommandType } from '../../types';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface Props {
  onCommand: (cmd: CommandType) => void;
  awaitingAnswer: boolean;
  disabled: boolean;
}

const commands: { cmd: CommandType; label: string; icon: IoniconName }[] = [
  { cmd: 'next', label: 'Next', icon: 'arrow-forward' },
  { cmd: 'repeat', label: 'Repeat', icon: 'refresh' },
  { cmd: 'hint', label: 'Hint', icon: 'bulb' },
  { cmd: 'exercise', label: 'Exercise', icon: 'barbell' },
  { cmd: 'summary', label: 'Summary', icon: 'list' },
];

export function CommandBar({ onCommand, awaitingAnswer, disabled }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="border-t border-gray-100 bg-surface"
      style={{ flexGrow: 0, flexShrink: 0 }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8, alignItems: 'center' }}
    >
      {commands.map(({ cmd, label, icon }) => {
        const isNextLocked = cmd === 'next' && awaitingAnswer;
        const isDisabled = disabled || isNextLocked;
        return (
          <TouchableOpacity
            key={cmd}
            onPress={() => onCommand(cmd)}
            disabled={isDisabled}
            activeOpacity={0.7}
            className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full border ${
              isDisabled
                ? 'border-gray-200 bg-gray-50'
                : 'border-primary bg-primary-light'
            }`}
          >
            <Ionicons
              name={icon}
              size={14}
              color={isDisabled ? '#9ca3af' : '#2563eb'}
            />
            <Text className={`text-sm font-medium ${isDisabled ? 'text-text-muted' : 'text-primary'}`}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
