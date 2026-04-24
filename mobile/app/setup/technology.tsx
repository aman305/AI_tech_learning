import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSetupStore } from '../../stores/useSetupStore';
import { SetupOptionTile } from '../../components/setup/SetupOptionTile';
import { techOptions } from '../../constants/techOptions';

export default function SetupTechnologyScreen() {
  const field = useSetupStore((s) => s.field);
  const technology = useSetupStore((s) => s.technology);
  const setTechnology = useSetupStore((s) => s.setTechnology);
  const options = field ? techOptions[field] : [];

  return (
    <View className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-6 pt-16" showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} className="mb-6">
          <Text className="text-primary text-base">← Back</Text>
        </TouchableOpacity>

        <View className="mb-2">
          <Text className="text-text-muted text-sm font-medium">Step 2 of 3</Text>
          <View className="flex-row gap-1 mt-2 mb-6">
            {[0,1,2].map(i => (
              <View key={i} className={`h-1 flex-1 rounded-full ${i <= 1 ? 'bg-primary' : 'bg-gray-200'}`} />
            ))}
          </View>
        </View>

        <Text className="text-text-main text-2xl font-bold mb-2">Pick your technology</Text>
        <Text className="text-text-muted text-base mb-8">
          {field ? `Technologies in ${field}` : 'Select a field first'}
        </Text>

        {options.map((tech) => (
          <SetupOptionTile
            key={tech}
            label={tech}
            selected={technology === tech}
            onPress={() => setTechnology(tech)}
          />
        ))}
      </ScrollView>

      <View className="px-6 pb-10 pt-4">
        <TouchableOpacity
          onPress={() => router.push('/setup/level')}
          disabled={!technology}
          className={`rounded-2xl py-4 items-center ${technology ? 'bg-primary' : 'bg-gray-300'}`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-lg">Next →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
