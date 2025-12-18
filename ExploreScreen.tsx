import React, { useMemo } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { topics, Topic } from "@/data/topics";
import { useUserDataContext } from "@/context/UserDataContext";

const UNLOCK_THRESHOLD = 2;

const categoryColors: Record<string, string> = {
  Science: "#8b5cf6",
  Sante: "#10b981",
  Environnement: "#22c55e",
  Technologie: "#3b82f6",
  Societe: "#f59e0b",
  Economie: "#ec4899",
  Politique: "#ef4444",
};

interface DiscoverCardProps {
  topic: Topic;
  isCompleted: boolean;
  isLiked: boolean;
  onPress: () => void;
}

function DiscoverCard({ topic, isCompleted, isLiked, onPress }: DiscoverCardProps) {
  const theme = Colors.dark;
  const categoryColor = categoryColors[topic.category] || theme.accent;

  return (
    <Pressable 
      style={styles.discoverCard}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <LinearGradient
        colors={[theme.backgroundDefault, theme.backgroundSecondary]}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + "30" }]}>
            <ThemedText style={[styles.categoryText, { color: categoryColor }]}>
              {topic.category}
            </ThemedText>
          </View>
          <View style={styles.cardIcons}>
            {isCompleted ? (
              <View style={styles.completedBadge}>
                <Feather name="check" size={14} color="#22c55e" />
              </View>
            ) : null}
            {isLiked ? (
              <Feather name="heart" size={16} color="#ef4444" />
            ) : null}
          </View>
        </View>
        
        <ThemedText style={styles.cardTitle}>{topic.title}</ThemedText>
        <ThemedText style={styles.cardDescription} numberOfLines={2}>
          {topic.sections[0].text}
        </ThemedText>
        
        <View style={styles.cardFooter}>
          <View style={styles.viewCount}>
            <Feather name="eye" size={14} color={theme.textMuted} />
            <ThemedText style={styles.viewCountText}>
              {topic.viewCount.toLocaleString()}
            </ThemedText>
          </View>
          <View style={styles.sectionCount}>
            <ThemedText style={styles.sectionCountText}>
              {topic.sections.length} sections
            </ThemedText>
            <Feather name="chevron-right" size={16} color={theme.textMuted} />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const theme = Colors.dark;
  const { completedTopics, likedTopics, isLiked, isCompleted } = useUserDataContext();
  const navigation = useNavigation();

  const isUnlocked = completedTopics.length >= UNLOCK_THRESHOLD;
  const progress = Math.min((completedTopics.length / UNLOCK_THRESHOLD) * 100, 100);

  const preferredCategories = useMemo(() => {
    const categoryScores: Record<string, number> = {};
    
    topics.forEach(topic => {
      if (isLiked(topic.id)) {
        categoryScores[topic.category] = (categoryScores[topic.category] || 0) + 2;
      }
      if (isCompleted(topic.id)) {
        categoryScores[topic.category] = (categoryScores[topic.category] || 0) + 1;
      }
    });
    
    return Object.entries(categoryScores)
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category);
  }, [likedTopics, completedTopics, isLiked, isCompleted]);

  const recommendedTopics = useMemo(() => {
    const notCompleted = topics.filter(t => !isCompleted(t.id));
    
    if (preferredCategories.length === 0) {
      return notCompleted.sort((a, b) => b.viewCount - a.viewCount).slice(0, 3);
    }
    
    const scored = notCompleted.map(topic => {
      const categoryIndex = preferredCategories.indexOf(topic.category);
      const score = categoryIndex >= 0 ? preferredCategories.length - categoryIndex : 0;
      return { topic, score };
    });
    
    return scored
      .sort((a, b) => b.score - a.score || b.topic.viewCount - a.topic.viewCount)
      .slice(0, 3)
      .map(({ topic }) => topic);
  }, [preferredCategories, completedTopics, isCompleted]);

  const discoverTopics = useMemo(() => {
    const recommendedIds = new Set(recommendedTopics.map(t => t.id));
    const notCompleted = topics.filter(t => !isCompleted(t.id) && !recommendedIds.has(t.id));
    const completed = topics.filter(t => isCompleted(t.id));
    return [...notCompleted, ...completed];
  }, [completedTopics, isCompleted, recommendedTopics]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(topics.map(t => t.category))];
    return uniqueCategories;
  }, []);

  const handleTopicPress = (topic: Topic) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  if (!isUnlocked) {
    return (
      <LinearGradient
        colors={[theme.accentSecondary, theme.backgroundRoot]}
        style={styles.container}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
      >
        <View
          style={[
            styles.content,
            {
              paddingTop: insets.top + Spacing.xl,
              paddingBottom: tabBarHeight + Spacing["3xl"],
            },
          ]}
        >
          <View style={styles.lockedContainer}>
            <View style={styles.lockIcon}>
              <Feather name="lock" size={48} color={theme.textMuted} />
            </View>
            <ThemedText style={styles.lockedTitle}>Explorer</ThemedText>
            <ThemedText style={styles.lockedDescription}>
              Completez {UNLOCK_THRESHOLD} sujets pour debloquer la section Explorer et decouvrir de nouveaux contenus.
            </ThemedText>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <ThemedText style={styles.progressText}>
                {completedTopics.length}/{UNLOCK_THRESHOLD} sujets
              </ThemedText>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[theme.accentSecondary, theme.backgroundRoot]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.6 }}
    >
      <FlatList
        data={discoverTopics}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing["3xl"],
          paddingHorizontal: Spacing.lg,
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>Explorer</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Decouvrez de nouveaux sujets et approfondissez votre reflexion
            </ThemedText>
            <View style={styles.categoriesRow}>
              {categories.slice(0, 4).map((cat) => (
                <View 
                  key={cat} 
                  style={[
                    styles.categoryChip,
                    { backgroundColor: (categoryColors[cat] || theme.accent) + "20" }
                  ]}
                >
                  <ThemedText 
                    style={[
                      styles.categoryChipText,
                      { color: categoryColors[cat] || theme.accent }
                    ]}
                  >
                    {cat}
                  </ThemedText>
                </View>
              ))}
            </View>

            {recommendedTopics.length > 0 ? (
              <View style={styles.recommendedSection}>
                <View style={styles.recommendedHeader}>
                  <Feather name="zap" size={18} color={theme.accent} />
                  <ThemedText style={styles.recommendedTitle}>
                    Recommande pour vous
                  </ThemedText>
                </View>
                <ThemedText style={styles.recommendedSubtitle}>
                  Base sur vos interactions
                </ThemedText>
                {recommendedTopics.map((topic) => (
                  <DiscoverCard
                    key={`rec-${topic.id}`}
                    topic={topic}
                    isCompleted={isCompleted(topic.id)}
                    isLiked={isLiked(topic.id)}
                    onPress={() => handleTopicPress(topic)}
                  />
                ))}
                <View style={styles.sectionDivider}>
                  <ThemedText style={styles.sectionDividerText}>
                    Tous les sujets
                  </ThemedText>
                </View>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <DiscoverCard
            topic={item}
            isCompleted={isCompleted(item.id)}
            isLiked={isLiked(item.id)}
            onPress={() => handleTopicPress(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{ bottom: tabBarHeight }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  lockedContainer: {
    alignItems: "center",
    padding: Spacing["3xl"],
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.lg,
    width: "100%",
    maxWidth: 340,
  },
  lockIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.dark.backgroundTertiary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
    opacity: 0.6,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: Spacing.md,
  },
  lockedDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.dark.textMuted,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.dark.accent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: Colors.dark.textMuted,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.dark.textMuted,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  discoverCard: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  cardGradient: {
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
    lineHeight: 26,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.dark.textMuted,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  viewCountText: {
    fontSize: 13,
    color: Colors.dark.textMuted,
  },
  sectionCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sectionCountText: {
    fontSize: 13,
    color: Colors.dark.textMuted,
  },
  recommendedSection: {
    marginTop: Spacing.xl,
  },
  recommendedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark.text,
  },
  recommendedSubtitle: {
    fontSize: 14,
    color: Colors.dark.textMuted,
    marginBottom: Spacing.md,
  },
  sectionDivider: {
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionDividerText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark.text,
  },
});
