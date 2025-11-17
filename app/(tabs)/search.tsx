import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { mockRecipes, categories } from "../data/recipes";
import { LinearGradient } from 'expo-linear-gradient';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = [
    'Under 30 mins',
    'Vegetarian',
    'Gluten-free',
    'Low carb',
    'Easy',
    'Quick'
  ];

  const recentSearches = ['Pasta', 'Chicken', 'Salad', 'Dessert'];

  const filteredRecipes = mockRecipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilters = selectedFilters.length === 0 ||
      selectedFilters.some(filter => {
        switch (filter) {
          case 'Under 30 mins':
            return recipe.cookTime <= 30;
          case 'Vegetarian':
            return recipe.tags.includes('Vegan') || recipe.category.toLowerCase().includes('vegetarian');
          case 'Easy':
            return recipe.difficulty === 'Easy';
          case 'Quick':
            return recipe.cookTime <= 20;
          default:
            return recipe.tags.includes(filter);
        }
      });

    return matchesSearch && matchesFilters;
  });

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleRecipePress = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
  };

  const handleSortPress = () => {
    // Show sort options
    console.log('Show sort options');
  };

  const handleTrendingPress = (query: string) => {
    setSearchQuery(query);
  };

  const handleFavoriteToggle = (recipeId: string, currentlyFavorite: boolean) => {
    console.log(`Toggle favorite for recipe ${recipeId}, currently: ${currentlyFavorite}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#0ea5e9', '#0284c7', '#0369a1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Ionicons name="search" size={32} color="white" />
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>Find your perfect recipe</Text>
        </LinearGradient>

        {/* Search Input */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <View style={styles.searchIconContainer}>
              <Ionicons name="search" size={20} color="#0ea5e9" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipes, ingredients, tags..."
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

          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => toggleFilter(filter)}
                style={[
                  styles.filterChip,
                  selectedFilters.includes(filter) && styles.filterChipActive
                ]}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilters.includes(filter) && styles.filterTextActive
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results */}
        {searchQuery.length > 0 || selectedFilters.length > 0 ? (
          <View style={[styles.resultsSection, styles.lastSection]}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {filteredRecipes.length} recipes found
              </Text>
              <TouchableOpacity style={styles.sortButton} onPress={handleSortPress}>
                <Text style={styles.sortText}>Sort by</Text>
                <Ionicons name="chevron-down" size={16} color="#0ea5e9" />
              </TouchableOpacity>
            </View>

            {filteredRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                onPress={() => handleRecipePress(recipe.id)}
                style={styles.recipeCard}
              >
                <Image
                  source={{ uri: recipe.image }}
                  style={styles.recipeImage}
                  resizeMode="cover"
                />
                <View style={styles.recipeContent}>
                  <View style={styles.recipeHeader}>
                    <Text style={styles.recipeTitle} numberOfLines={1}>{recipe.title}</Text>
                    <TouchableOpacity 
                      style={styles.favoriteButton}
                      onPress={() => handleFavoriteToggle(recipe.id, recipe.isFavorite)}
                    >
                      <Ionicons
                        name={recipe.isFavorite ? "heart" : "heart-outline"}
                        size={20}
                        color={recipe.isFavorite ? "#ef4444" : "#64748b"}
                      />
                    </TouchableOpacity>
                  </View>

                  {recipe.rating && (
                    <View style={styles.ratingContainer}>
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={12} color="#fbbf24" />
                        <Text style={styles.ratingText}>{recipe.rating}</Text>
                      </View>
                      <Text style={styles.reviewsText}>({recipe.reviews?.toLocaleString()} reviews)</Text>
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
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            {/* Recent Searches */}
            <View style={styles.recentSearches}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              {recentSearches.map((search) => (
                <TouchableOpacity
                  key={search}
                  onPress={() => setSearchQuery(search)}
                  style={styles.recentSearchItem}
                >
                  <View style={styles.recentSearchIcon}>
                    <Ionicons name="time-outline" size={18} color="#64748b" />
                  </View>
                  <Text style={styles.recentSearchText}>{search}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Popular Categories */}
            <View style={styles.popularCategories}>
              <Text style={styles.sectionTitle}>Popular Categories</Text>
              <View style={styles.categoriesGrid}>
                {categories.slice(0, 6).map((category, index) => (
                  <TouchableOpacity
                    key={category}
                    style={styles.categoryCard}
                    onPress={() => setSearchQuery(category)}
                  >
                    <LinearGradient
                      colors={categoryGradients[index % categoryGradients.length]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.categoryGradient}
                    >
                      <Ionicons 
                        name={categoryIcons[index % categoryIcons.length] as any} 
                        size={24} 
                        color="white" 
                      />
                      <Text style={styles.categoryText}>{category}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Trending */}
            <View style={[styles.trendingSection, styles.lastSection]}>
              <Text style={styles.sectionTitle}>Trending Now</Text>
              <View style={styles.trendingGrid}>
                <TouchableOpacity style={styles.trendingItem} onPress={() => handleTrendingPress('Summer Salads')}>
                  <Ionicons name="trending-up" size={16} color="#10b981" />
                  <Text style={styles.trendingText}>Summer Salads</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.trendingItem} onPress={() => handleTrendingPress('Quick Breakfast')}>
                  <Ionicons name="trending-up" size={16} color="#10b981" />
                  <Text style={styles.trendingText}>Quick Breakfast</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.trendingItem} onPress={() => handleTrendingPress('Healthy Snacks')}>
                  <Ionicons name="trending-up" size={16} color="#10b981" />
                  <Text style={styles.trendingText}>Healthy Snacks</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const categoryGradients: readonly [string, string][] = [
  ['#fbbf24', '#f59e0b'],
  ['#10b981', '#059669'],
  ['#ef4444', '#dc2626'],
  ['#a855f7', '#9333ea'],
  ['#06b6d4', '#0891b2'],
  ['#ec4899', '#db2777'],
];

const categoryIcons = [
  'restaurant',
  'leaf',
  'flame',
  'pizza',
  'fish',
  'ice-cream',
] as const;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100,
  },
  header: {
    padding: 24,
    paddingTop: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  searchIconContainer: {
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    padding: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  clearButton: {
    padding: 4,
  },
  filtersScroll: {
    marginTop: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTextActive: {
    color: 'white',
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sortText: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '600',
    marginRight: 4,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  recipeImage: {
    width: '100%',
    height: 180,
  },
  recipeContent: {
    padding: 16,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 4,
  },
  difficultyBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  emptyState: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  recentSearches: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recentSearchIcon: {
    marginRight: 12,
  },
  recentSearchText: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  popularCategories: {
    marginBottom: 32,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '47%',
  },
  categoryGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    marginTop: 8,
  },
  trendingSection: {
    marginBottom: 32,
  },
  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  trendingText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
    marginLeft: 6,
  },
  lastSection: {
    paddingBottom: 100,
  },
});