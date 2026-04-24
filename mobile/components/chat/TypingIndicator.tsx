import { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export function TypingIndicator() {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      )
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View className="flex-row items-end mb-4 px-4">
      <View className="bg-surface rounded-2xl rounded-bl-sm px-4 py-3 flex-row gap-1 items-center shadow-sm">
        {dots.map((dot, i) => (
          <Animated.View
            key={i}
            className="w-2 h-2 rounded-full bg-text-muted"
            style={{ opacity: dot, transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }] }}
          />
        ))}
      </View>
    </View>
  );
}
