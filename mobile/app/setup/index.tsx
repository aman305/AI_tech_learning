import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSetupStore } from '../../stores/useSetupStore';
import { SetupOptionTile } from '../../components/setup/SetupOptionTile';
import { Field } from '../../types';
import { fieldIcons, fieldIconColors } from '../../constants/techOptions';

const fields: { label: Field; description: string }[] = [
  { label: 'Software Development', description: 'Python, JS, Flutter, and more' },
  { label: 'QA', description: 'Selenium, Cypress, Playwright' },
  { label: 'Data & AI', description: 'ML, TensorFlow, SQL, Pandas' },
  { label: 'DevOps', description: 'Docker, Kubernetes, AWS, CI/CD' },
];

export default function SetupFieldScreen() {
  const field = useSetupStore((s) => s.field);
  const setField = useSetupStore((s) => s.setField);

  return (
    <View className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-6 pt-16" showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} className="mb-6">
          <Text className="text-primary text-base">← Back</Text>
        </TouchableOpacity>

        <View className="mb-2">
          <Text className="text-text-muted text-sm font-medium">Step 1 of 3</Text>
          <View className="flex-row gap-1 mt-2 mb-6">
            {[0,1,2].map(i => (
              <View key={i} className={`h-1 flex-1 rounded-full ${i === 0 ? 'bg-primary' : 'bg-gray-200'}`} />
            ))}
          </View>
        </View>

        <Text className="text-text-main text-2xl font-bold mb-2">What do you want to learn?</Text>
        <Text className="text-text-muted text-base mb-8">Choose your learning domain</Text>

        {fields.map(({ label, description }) => (
          <SetupOptionTile
            key={label}
            label={label}
            icon={fieldIcons[label]}
            iconColor={fieldIconColors[label].fg}
            iconBg={fieldIconColors[label].bg}
            description={description}
            selected={field === label}
            onPress={() => setField(label)}
          />
        ))}
      </ScrollView>

      <View className="px-6 pb-10 pt-4">
        <TouchableOpacity
          onPress={() => router.push('/setup/technology')}
          disabled={!field}
          className={`rounded-2xl py-4 items-center ${field ? 'bg-primary' : 'bg-gray-300'}`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-lg">Next →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
