import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { mockRecipes } from "../data/recipes";

export default function MyRecipesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("created");

  // Filter recipes - for now using mock data, but in real app would filter user's recipes
  const createdRecipes = mockRecipes.filter(recipe => parseInt(recipe.id) <= 5);
  const favoriteRecipes = mockRecipes.filter(recipe => recipe.isFavorite);

  const currentRecipes = selectedTab === "created" ? createdRecipes : favoriteRecipes;
  const filteredRecipes = currentRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: "created", label: "Created", count: createdRecipes.length, icon: "create-outline" },
    { id: "favorites", label: "Favorites", count: favoriteRecipes.length, icon: "heart-outline" },
  ];

  const handleRecipePress = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
  };

  const handleEditRecipe = (recipeId: string) => {
    router.push('/add-recipe');
  };

  const handleDeleteRecipe = (recipeId: string) => {
    console.log(`Delete recipe ${recipeId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#0ea5e9", "#0284c7", "#0369a1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Recipes</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-recipe')}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" size={20} color="#0ea5e9" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search your recipes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#64748b"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, selectedTab === tab.id && styles.activeTab]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <View style={[styles.tabIcon, selectedTab === tab.id && styles.activeTabIcon]}>
              <Ionicons
                name={tab.icon as any}
                size={18}
                color={selectedTab === tab.id ? "#0ea5e9" : "#64748b"}
              />
            </View>
            <Text style={[styles.tabText, selectedTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
            <View style={[styles.tabCount, selectedTab === tab.id && styles.activeTabCount]}>
              <Text style={[styles.tabCountText, selectedTab === tab.id && styles.activeTabCountText]}>
                {tab.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Results */}
        <View style={[styles.resultsSection, styles.lastSection]}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {filteredRecipes.length} {selectedTab === "created" ? "recipes created" : "favorites"}
            </Text>
          </View>

          {filteredRecipes.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons
                  name={selectedTab === "created" ? "restaurant-outline" : "heart-outline"}
                  size={48}
                  color="#cbd5e1"
                />
              </View>
              <Text style={styles.emptyTitle}>
                {selectedTab === "created" ? "No recipes created yet" : "No favorites yet"}
              </Text>
              <Text style={styles.emptySubtitle}>
                {selectedTab === "created"
                  ? "Start creating your first recipe!"
                  : "Add recipes to favorites to see them here"
                }
              </Text>
              {selectedTab === "created" && (
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => router.push('/add-recipe')}
                >
                  <LinearGradient
                    colors={["#10b981", "#059669"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.createGradient}
                  >
                    <Ionicons name="add" size={20} color="white" />
                    <Text style={styles.createText}>Create Recipe</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filteredRecipes.map((recipe) => (
              <View key={recipe.id} style={styles.recipeCard}>
                <TouchableOpacity
                  onPress={() => handleRecipePress(recipe.id)}
                  style={styles.recipeContent}
                >
                  <Image
                    source={{ uri: recipe.image }}
                    style={styles.recipeImage}
                    resizeMode="cover"
                  />
                  <View style={styles.recipeInfo}>
                    <View style={styles.recipeHeader}>
                      <Text style={styles.recipeTitle} numberOfLines={1}>
                        {recipe.title}
                      </Text>
                      {selectedTab === "created" && (
                        <View style={styles.recipeActions}>
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleEditRecipe(recipe.id)}
                          >
                            <Ionicons name="create-outline" size={18} color="#0ea5e9" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleDeleteRecipe(recipe.id)}
                          >
                            <Ionicons name="trash-outline" size={18} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    {recipe.rating && (
                      <View style={styles.ratingContainer}>
                        <View style={styles.ratingBadge}>
                          <Ionicons name="star" size={12} color="#fbbf24" />
                          <Text style={styles.ratingText}>{recipe.rating}</Text>
                        </View>
                        <Text style={styles.reviewsText}>
                          ({recipe.reviews?.toLocaleString()} reviews)
                        </Text>
                      </View>
                    )}

                    <View style={styles.recipeMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={14} color="#64748b" />
                        <Text style={styles.metaText}>{recipe.cookTime} min</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="people-outline" size={14} color="#64748b" />
                        <Text style={styles.metaText}>{recipe.servings} servings</Text>
                      </View>
                      <View style={styles.difficultyBadge}>
                        <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
                      </View>
                    </View>

                    <View style={styles.tagsContainer}>
                      {recipe.tags.slice(0, 3).map((tag) => (
                        <View key={tag} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  addButton: {
    padding: 4,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIconContainer: {
    backgroundColor: "#e0f2fe",
    borderRadius: 10,
    padding: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
  },
  clearButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeTab: {
    backgroundColor: "#e0f2fe",
    borderWidth: 1,
    borderColor: "#0ea5e9",
  },
  tabIcon: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 4,
  },
  activeTabIcon: {
    backgroundColor: "#bfdbfe",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  activeTabText: {
    color: "#0ea5e9",
  },
  tabCount: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  activeTabCount: {
    backgroundColor: "#0ea5e9",
  },
  tabCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  activeTabCountText: {
    color: "white",
  },
  scrollView: {
    flex: 1,
  },
  resultsSection: {
    paddingHorizontal: 20,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  recipeCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  recipeContent: {
    flexDirection: "row",
  },
  recipeImage: {
    width: 100,
    height: 120,
  },
  recipeInfo: {
    flex: 1,
    padding: 16,
  },
  recipeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
    marginRight: 8,
  },
  recipeActions: {
    flexDirection: "row",
    gap: 4,
  },
  actionButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#f8fafc",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#92400e",
    marginLeft: 2,
  },
  reviewsText: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "500",
  },
  recipeMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  metaText: {
    fontSize: 12,
    color: "#64748b",
  },
  difficultyBadge: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    color: "#059669",
    fontWeight: "600",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  tag: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    color: "#475569",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 32,
    padding: 20,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  createButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  createText: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },
  lastSection: {
    paddingBottom: 100,
  },
});