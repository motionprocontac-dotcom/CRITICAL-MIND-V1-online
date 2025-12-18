import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { topics, Topic } from "@/data/topics";
import { useUserDataContext } from "@/context/UserDataContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.55;
const SWIPE_THRESHOLD = 50;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = Colors.dark;
  const {
    points,
    toggleLike,
    toggleFavorite,
    isLiked,
    isFavorited,
    addPoints,
    markTopicCompleted,
  } = useUserDataContext();

  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const currentTopic = topics[currentTopicIndex];
  const currentSection = currentTopic.sections[currentSectionIndex];

  const translateX = useSharedValue(0);
  const cardScale = useSharedValue(1);

  const goToNextSection = useCallback(() => {
    if (currentSectionIndex < currentTopic.sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      markTopicCompleted(currentTopic.id);
      addPoints(10);
      if (currentTopicIndex < topics.length - 1) {
        setCurrentTopicIndex((prev) => prev + 1);
        setCurrentSectionIndex(0);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, [currentSectionIndex, currentTopic, currentTopicIndex, markTopicCompleted, addPoints]);

  const goToNextTopic = useCallback(() => {
    if (currentTopicIndex < topics.length - 1) {
      setCurrentTopicIndex((prev) => prev + 1);
      setCurrentSectionIndex(0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [currentTopicIndex]);

  const goToPrevTopic = useCallback(() => {
    if (currentTopicIndex > 0) {
      setCurrentTopicIndex((prev) => prev - 1);
      setCurrentSectionIndex(0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [currentTopicIndex]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX * 0.5;
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD) {
        runOnJS(goToPrevTopic)();
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        runOnJS(goToNextTopic)();
      }
      translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(goToNextSection)();
  });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: cardScale.value },
    ],
  }));

  const handleLike = useCallback(() => {
    toggleLike(currentTopic.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [toggleLike, currentTopic.id]);

  const handleFavorite = useCallback(() => {
    toggleFavorite(currentTopic.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [toggleFavorite, currentTopic.id]);

  const likeScale = useSharedValue(1);
  const favoriteScale = useSharedValue(1);

  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const favoriteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteScale.value }],
  }));

  const handleLikePress = () => {
    likeScale.value = withSpring(0.85, { damping: 10 }, () => {
      likeScale.value = withSpring(1, { damping: 10 });
    });
    handleLike();
  };

  const handleFavoritePress = () => {
    favoriteScale.value = withSpring(0.85, { damping: 10 }, () => {
      favoriteScale.value = withSpring(1, { damping: 10 });
    });
    handleFavorite();
  };

  return (
    <LinearGradient
      colors={[theme.accentSecondary, theme.backgroundRoot]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.6 }}
    >
      <View style={[styles.pointsBadge, { top: insets.top + Spacing.lg }]}>
        <ThemedText style={styles.pointsText}>
          Clarte {points}
        </ThemedText>
      </View>

      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
          <LinearGradient
            colors={[theme.backgroundDefault, theme.backgroundSecondary]}
            style={styles.card}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            <View style={styles.progressContainer}>
              {currentTopic.sections.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressSegment,
                    index <= currentSectionIndex
                      ? styles.progressActive
                      : styles.progressInactive,
                  ]}
                />
              ))}
            </View>

            <View style={styles.contentContainer}>
              <ThemedText style={styles.title}>{currentSection.title}</ThemedText>
              <ThemedText style={styles.description}>
                {currentSection.text}
              </ThemedText>
            </View>

            <View style={styles.footer}>
              <View style={styles.viewCount}>
                <Feather name="eye" size={14} color={theme.textMuted} />
                <ThemedText style={styles.footerText}>
                  {currentTopic.viewCount.toLocaleString()}
                </ThemedText>
              </View>
              <ThemedText style={styles.footerText}>
                Surface - Abysses
              </ThemedText>
            </View>
          </LinearGradient>
        </Animated.View>
      </GestureDetector>

      <View style={[styles.actionsContainer, { bottom: 150 + insets.bottom }]}>
        <AnimatedPressable
          style={[styles.actionButton, likeAnimatedStyle]}
          onPress={handleLikePress}
        >
          <Feather
            name="heart"
            size={22}
            color={isLiked(currentTopic.id) ? "#ef4444" : theme.text}
          />
        </AnimatedPressable>
        <AnimatedPressable
          style={[styles.actionButton, favoriteAnimatedStyle]}
          onPress={handleFavoritePress}
        >
          <Feather
            name="star"
            size={22}
            color={isFavorited(currentTopic.id) ? "#fbbf24" : theme.text}
          />
        </AnimatedPressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pointsBadge: {
    position: "absolute",
    right: Spacing.xl,
  },
  pointsText: {
    fontSize: 14,
    color: Colors.dark.textMuted,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 6,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressActive: {
    backgroundColor: Colors.dark.accent,
  },
  progressInactive: {
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: Spacing.md,
    color: Colors.dark.text,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    color: Colors.dark.textMuted,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    color: Colors.dark.textMuted,
  },
  actionsContainer: {
    position: "absolute",
    flexDirection: "row",
    gap: 28,
  },
  actionButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.dark.actionButton,
    alignItems: "center",
    justifyContent: "center",
  },
});
