import React, { useMemo } from "react";
import { View, StyleSheet, ScrollView, Pressable, Share, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { topics } from "@/data/topics";
import { useUserDataContext } from "@/context/UserDataContext";

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: keyof typeof Feather.glyphMap;
  value: string | number;
  label: string;
  color: string;
}) {
  const theme = Colors.dark;

  return (
    <View style={styles.statCard}>
      <LinearGradient
        colors={[theme.backgroundDefault, theme.backgroundSecondary]}
        style={styles.statCardGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
          <Feather name={icon} size={24} color={color} />
        </View>
        <ThemedText style={styles.statValue}>{value}</ThemedText>
        <ThemedText style={styles.statLabel}>{label}</ThemedText>
      </LinearGradient>
    </View>
  );
}

function CategoryProgress({
  category,
  completed,
  total,
  color,
}: {
  category: string;
  completed: number;
  total: number;
  color: string;
}) {
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <View style={styles.categoryItem}>
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryDot, { backgroundColor: color }]} />
        <ThemedText style={styles.categoryName}>{category}</ThemedText>
        <ThemedText style={styles.categoryCount}>
          {completed}/{total}
        </ThemedText>
      </View>
      <View style={styles.categoryProgressBar}>
        <View 
          style={[
            styles.categoryProgressFill, 
            { width: `${progress}%`, backgroundColor: color }
          ]} 
        />
      </View>
    </View>
  );
}

const categoryColors: Record<string, string> = {
  Science: "#8b5cf6",
  Sante: "#10b981",
  Environnement: "#22c55e",
  Technologie: "#3b82f6",
  Societe: "#f59e0b",
  Economie: "#ec4899",
  Politique: "#ef4444",
};

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const theme = Colors.dark;
  const { points, likedTopics, favoritedTopics, completedTopics, isCompleted } =
    useUserDataContext();

  const levelProgress = (completedTopics.length / topics.length) * 100;
  const currentLevel = Math.floor(points / 100) + 1;

  const categoryStats = useMemo(() => {
    const stats: Record<string, { completed: number; total: number }> = {};
    
    topics.forEach(topic => {
      if (!stats[topic.category]) {
        stats[topic.category] = { completed: 0, total: 0 };
      }
      stats[topic.category].total++;
      if (isCompleted(topic.id)) {
        stats[topic.category].completed++;
      }
    });
    
    return Object.entries(stats).map(([category, data]) => ({
      category,
      ...data,
      color: categoryColors[category] || theme.accent,
    }));
  }, [completedTopics, isCompleted]);

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const message = `Je suis niveau ${currentLevel} sur Critical Mind avec ${points} points de Clarte.\n\nJ'ai explore ${completedTopics.length} sujets controverses pour developper mon esprit critique.`;
    
    try {
      if (Platform.OS === "web") {
        if (navigator.share) {
          await navigator.share({
            title: "Mes progres sur Critical Mind",
            text: message,
          });
        } else {
          await navigator.clipboard.writeText(message);
          alert("Copie dans le presse-papier!");
        }
      } else {
        await Share.share({
          message,
          title: "Mes progres sur Critical Mind",
        });
      }
    } catch (error) {
      console.log("Share cancelled or failed:", error);
    }
  };

  const recentlyCompleted = useMemo(() => {
    return topics.filter(t => isCompleted(t.id)).slice(0, 3);
  }, [completedTopics, isCompleted]);

  return (
    <LinearGradient
      colors={[theme.accentSecondary, theme.backgroundRoot]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.6 }}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing["3xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{ bottom: tabBarHeight }}
      >
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Profil</ThemedText>
          <Pressable 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Feather name="share-2" size={20} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.profileCard}>
          <LinearGradient
            colors={[theme.backgroundDefault, theme.backgroundSecondary]}
            style={styles.profileCardGradient}
          >
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[theme.accent, theme.accentSecondary]}
                style={styles.avatar}
              >
                <Feather name="user" size={32} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <ThemedText style={styles.profileTitle}>Penseur Critique</ThemedText>
            <ThemedText style={styles.profileSubtitle}>
              Niveau {currentLevel}
            </ThemedText>
          </LinearGradient>
        </View>

        <View style={styles.pointsCard}>
          <LinearGradient
            colors={[theme.accent, theme.accentSecondary]}
            style={styles.pointsCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.pointsContent}>
              <View>
                <ThemedText style={styles.pointsLabel}>Clarte</ThemedText>
                <ThemedText style={styles.pointsValue}>{points}</ThemedText>
              </View>
              <Pressable 
                style={styles.sharePointsButton}
                onPress={handleShare}
              >
                <Feather name="share" size={18} color="#FFFFFF" />
                <ThemedText style={styles.shareButtonText}>Partager</ThemedText>
              </Pressable>
            </View>
            <View style={styles.levelProgressContainer}>
              <View style={styles.levelProgressBar}>
                <View
                  style={[
                    styles.levelProgressFill,
                    { width: `${points % 100}%` },
                  ]}
                />
              </View>
              <ThemedText style={styles.levelProgressText}>
                {points % 100}/100 vers niveau {currentLevel + 1}
              </ThemedText>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="check-circle"
            value={completedTopics.length}
            label="Sujets termines"
            color="#22c55e"
          />
          <StatCard
            icon="heart"
            value={likedTopics.length}
            label="Sujets aimes"
            color="#ef4444"
          />
          <StatCard
            icon="star"
            value={favoritedTopics.length}
            label="Favoris"
            color="#fbbf24"
          />
          <StatCard
            icon="book-open"
            value={topics.length}
            label="Sujets disponibles"
            color="#3b82f6"
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Progression par categorie</ThemedText>
          <View style={styles.categoriesCard}>
            <LinearGradient
              colors={[theme.backgroundDefault, theme.backgroundSecondary]}
              style={styles.categoriesCardGradient}
            >
              {categoryStats.map((cat) => (
                <CategoryProgress
                  key={cat.category}
                  category={cat.category}
                  completed={cat.completed}
                  total={cat.total}
                  color={cat.color}
                />
              ))}
            </LinearGradient>
          </View>
        </View>

        {recentlyCompleted.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Recemment explores</ThemedText>
              <Pressable 
                onPress={handleShare}
                style={styles.shareSmallButton}
              >
                <Feather name="share-2" size={16} color={theme.accent} />
              </Pressable>
            </View>
            {recentlyCompleted.map((topic) => (
              <View key={topic.id} style={styles.recentCard}>
                <LinearGradient
                  colors={[theme.backgroundDefault, theme.backgroundSecondary]}
                  style={styles.recentCardGradient}
                >
                  <View style={styles.recentContent}>
                    <View style={[styles.completedBadge, { backgroundColor: "#22c55e20" }]}>
                      <Feather name="check" size={14} color="#22c55e" />
                    </View>
                    <View style={styles.recentInfo}>
                      <ThemedText style={styles.recentTitle} numberOfLines={1}>
                        {topic.title}
                      </ThemedText>
                      <ThemedText style={styles.recentCategory}>
                        {topic.category}
                      </ThemedText>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Progression globale</ThemedText>
          <View style={styles.achievementCard}>
            <LinearGradient
              colors={[theme.backgroundDefault, theme.backgroundSecondary]}
              style={styles.achievementCardGradient}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            >
              <View style={styles.achievementHeader}>
                <ThemedText style={styles.achievementTitle}>
                  Exploration complete
                </ThemedText>
                <ThemedText style={styles.achievementProgress}>
                  {completedTopics.length}/{topics.length}
                </ThemedText>
              </View>
              <View style={styles.achievementProgressBar}>
                <View
                  style={[
                    styles.achievementProgressFill,
                    { width: `${levelProgress}%` },
                  ]}
                />
              </View>
              <ThemedText style={styles.achievementDescription}>
                Completez tous les sujets pour devenir un penseur critique accompli.
              </ThemedText>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.dark.text,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.backgroundDefault,
    alignItems: "center",
    justifyContent: "center",
  },
  profileCard: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.lg,
  },
  profileCardGradient: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: Spacing.xs,
  },
  profileSubtitle: {
    fontSize: 14,
    color: Colors.dark.textMuted,
  },
  pointsCard: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.xl,
  },
  pointsCardGradient: {
    padding: Spacing.xl,
  },
  pointsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  pointsLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: Spacing.xs,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  sharePointsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  levelProgressContainer: {
    marginTop: Spacing.sm,
  },
  levelProgressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: Spacing.sm,
  },
  levelProgressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  levelProgressText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    width: "48%",
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  statCardGradient: {
    padding: Spacing.lg,
    alignItems: "center",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.dark.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.dark.textMuted,
    textAlign: "center",
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: Spacing.md,
  },
  shareSmallButton: {
    padding: Spacing.sm,
  },
  categoriesCard: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  categoriesCardGradient: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  categoryItem: {
    gap: Spacing.sm,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    color: Colors.dark.text,
  },
  categoryCount: {
    fontSize: 13,
    color: Colors.dark.textMuted,
  },
  categoryProgressBar: {
    height: 6,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderRadius: 3,
    overflow: "hidden",
  },
  categoryProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  recentCard: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    marginBottom: Spacing.sm,
  },
  recentCardGradient: {
    padding: Spacing.md,
  },
  recentContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.dark.text,
    marginBottom: 2,
  },
  recentCategory: {
    fontSize: 13,
    color: Colors.dark.textMuted,
  },
  achievementCard: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  achievementCardGradient: {
    padding: Spacing.lg,
  },
  achievementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark.text,
  },
  achievementProgress: {
    fontSize: 14,
    color: Colors.dark.accent,
    fontWeight: "600",
  },
  achievementProgressBar: {
    height: 8,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  achievementProgressFill: {
    height: "100%",
    backgroundColor: Colors.dark.accent,
    borderRadius: 4,
  },
  achievementDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.dark.textMuted,
  },
});
