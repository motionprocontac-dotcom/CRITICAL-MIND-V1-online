import React from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { topics, Topic } from "@/data/topics";
import { useUserDataContext } from "@/context/UserDataContext";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TopicCard({
  topic,
  isFavorited,
  onToggleFavorite,
}: {
  topic: Topic;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}) {
  const theme = Colors.dark;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <AnimatedPressable
      style={[styles.topicCard, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <LinearGradient
        colors={[theme.backgroundDefault, theme.backgroundSecondary]}
        style={styles.topicCardGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.topicCardContent}>
          <ThemedText style={styles.topicTitle} numberOfLines={2}>
            {topic.title}
          </ThemedText>
          <ThemedText style={styles.topicPreview} numberOfLines={2}>
            {topic.sections[0].text}
          </ThemedText>
          <View style={styles.topicMeta}>
            <View style={styles.viewCount}>
              <Feather name="eye" size={12} color={theme.textMuted} />
              <ThemedText style={styles.metaText}>
                {topic.viewCount.toLocaleString()}
              </ThemedText>
            </View>
            <ThemedText style={styles.metaText}>
              {topic.sections.length} sections
            </ThemedText>
          </View>
        </View>
        <Pressable
          style={styles.favoriteButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onToggleFavorite();
          }}
          hitSlop={10}
        >
          <Feather
            name="star"
            size={20}
            color={isFavorited ? "#fbbf24" : theme.textMuted}
          />
        </Pressable>
      </LinearGradient>
    </AnimatedPressable>
  );
}

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const theme = Colors.dark;
  const { favoritedTopics, toggleFavorite, isFavorited } = useUserDataContext();

  const savedTopics = topics.filter((topic) =>
    favoritedTopics.includes(topic.id),
  );

  const renderItem = ({ item }: { item: Topic }) => (
    <TopicCard
      topic={item}
      isFavorited={isFavorited(item.id)}
      onToggleFavorite={() => toggleFavorite(item.id)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Feather name="bookmark" size={48} color={theme.textMuted} />
      </View>
      <ThemedText style={styles.emptyTitle}>Bibliotheque vide</ThemedText>
      <ThemedText style={styles.emptyDescription}>
        Ajoutez des sujets a vos favoris pour les retrouver ici.
      </ThemedText>
    </View>
  );

  return (
    <LinearGradient
      colors={[theme.accentSecondary, theme.backgroundRoot]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.6 }}
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <ThemedText style={styles.headerTitle}>Bibliotheque</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {savedTopics.length} sujet{savedTopics.length !== 1 ? "s" : ""} sauvegarde
          {savedTopics.length !== 1 ? "s" : ""}
        </ThemedText>
      </View>
      <FlatList
        data={savedTopics}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: tabBarHeight + Spacing["3xl"],
          },
        ]}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.dark.text,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.dark.textMuted,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
  },
  topicCard: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  topicCardGradient: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  topicCardContent: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  topicPreview: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.dark.textMuted,
    marginBottom: Spacing.md,
  },
  topicMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  viewCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.dark.textMuted,
  },
  favoriteButton: {
    padding: Spacing.sm,
    alignSelf: "flex-start",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["3xl"],
    paddingTop: 100,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.dark.backgroundDefault,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.dark.textMuted,
    textAlign: "center",
  },
});
