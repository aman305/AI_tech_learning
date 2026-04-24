import { View, Text } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Colors } from '../../constants/colors';
import { Message } from '../../types';

const markdownStyles = {
  body: { color: Colors.textMain, fontSize: 15, lineHeight: 22 },
  heading1: { color: Colors.textMain, fontSize: 20, fontWeight: '700' as const, marginBottom: 8 },
  heading2: { color: Colors.textMain, fontSize: 18, fontWeight: '700' as const, marginBottom: 6 },
  heading3: { color: Colors.primary, fontSize: 16, fontWeight: '600' as const, marginBottom: 4, marginTop: 8 },
  strong: { fontWeight: '700' as const, color: Colors.textMain },
  code_inline: {
    backgroundColor: '#f3f4f6', color: Colors.primary,
    fontFamily: 'monospace', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, fontSize: 13,
  },
  fence: {
    backgroundColor: Colors.codeBg, borderRadius: 8, padding: 12,
    marginVertical: 8,
  },
  code_block: {
    backgroundColor: Colors.codeBg, borderRadius: 8, padding: 12,
    fontFamily: 'monospace', color: Colors.codeText, fontSize: 13,
  },
  bullet_list: { marginVertical: 4 },
  list_item: { marginVertical: 2 },
  paragraph: { marginVertical: 4 },
};

interface Props {
  message: Message;
}

export function ChatBubble({ message }: Props) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <View className="flex-row justify-end mb-3 px-4">
        <View className="bg-primary rounded-2xl rounded-br-sm px-4 py-3 max-w-[80%]">
          <Text className="text-white text-base leading-6">{message.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row justify-start mb-3 px-4">
      <View className="bg-surface rounded-2xl rounded-bl-sm px-4 py-3 max-w-[90%] shadow-sm">
        <Markdown style={markdownStyles}>{message.content}</Markdown>
      </View>
    </View>
  );
}
