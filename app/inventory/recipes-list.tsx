import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { mockRecipes, Recipe } from '../data/recipes';
import { LinearGradient } from 'expo-linear-gradient';
import { InventoryStorage } from '../services/inventoryStorage';
import { InventoryItem } from '../data/inventory';

export default function RecipesListScreen() {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const hasStored = await InventoryStorage.hasStoredInventory();
      if (hasStored) {
        const storedInventory = await InventoryStorage.loadInventory();
        setInventory(storedInventory);
      }
    } catch (error) {
      console.error('Failed to load inventory:', error);
    }
  };

  const findRecipesWithAvailableIngredients = (): Array<{
    recipe: Recipe;
    matchedIngredients: number;
    totalIngredients: number;
    matchPercentage: number;
  }> => {
    const inventoryNames = inventory.map(item => item.name.toLowerCase().trim());

    return mockRecipes
      .map(recipe => {
        let matchedIngredients = 0;
        const totalIngredients = recipe.ingredients.length;

        recipe.ingredients.forEach(ingredient => {
          const ingredientName = ingredient.name.toLowerCase().trim();

          const hasExactMatch = inventoryNames.some(invItem => invItem === ingredientName);
          const hasPartialMatch = inventoryNames.some(invItem => {
            const ingredientWords = ingredientName.split(' ');
            const inventoryWords = invItem.split(' ');

            const keyWords = ingredientWords.filter(word =>
              !['fresh', 'dried', 'ground', 'whole', 'chopped', 'sliced', 'diced', 'cooked'].includes(word)
            );
            const invKeyWords = inventoryWords.filter(word =>
              !['fresh', 'dried', 'ground', 'whole', 'chopped', 'sliced', 'diced', 'cooked'].includes(word)
            );

            return (
              keyWords.some(word => invKeyWords.includes(word)) ||
              invKeyWords.some(word => keyWords.includes(word))
            );
          });

          if (hasExactMatch || hasPartialMatch) {
            matchedIngredients++;
          }
        });

        const matchPercentage = Math.round((matchedIngredients / totalIngredients) * 100);

        return {
          recipe,
          matchedIngredients,
          totalIngredients,
          matchPercentage
        };
      })
      .filter(result => result.matchedIngredients > 0)
      .sort((a, b) => {
        if (b.matchPercentage === a.matchPercentage) {
          return b.matchedIngredients - a.matchedIngredients;
        }
        return b.matchPercentage - a.matchPercentage;
      });
  };

  const allRecipes = findRecipesWithAvailableIngredients();

  const filteredRecipes = allRecipes
    .filter(result => {
      const matchesSearch = result.recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        selectedFilter === 'all' ||
        (selectedFilter === 'high' && result.matchPercentage >= 80) ||
        (selectedFilter === 'medium' && result.matchPercentage >= 60 && result.matchPercentage < 80) ||
        (selectedFilter === 'low' && result.matchPercentage < 60);

      return matchesSearch && matchesFilter;
    });

  const getMatchBadgeColors = (percentage: number): [string, string] => {
    if (percentage >= 80) return ['#10b981', '#059669'];
    if (percentage >= 60) return ['#f59e0b', '#d97706'];
    return ['#ef4444', '#dc2626'];
  };

  const getMatchLabel = (percentage: number): string => {
    if (percentage >= 80) return 'High Match';
    if (percentage >= 60) return 'Good Match';
    return 'Partial Match';
  };

  const statsData = {
    total: allRecipes.length,
    high: allRecipes.filter(r => r.matchPercentage >= 80).length,
    medium: allRecipes.filter(r => r.matchPercentage >= 60 && r.matchPercentage < 80).length,
    low: allRecipes.filter(r => r.matchPercentage < 60).length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#0ea5e9', '#0284c7', '#0369a1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Ionicons name="restaurant" size={28} color="white" />
              <Text style={styles.headerTitle}>Available Recipes</Text>
            </View>
            <View style={styles.headerPlaceholder} />
          </View>
          <Text style={styles.headerSubtitle}>
            {allRecipes.length} recipes you can make with your ingredients
          </Text>
        </LinearGradient>

        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={[styles.statCard, selectedFilter === 'all' && styles.statCardActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <View style={[styles.statIcon, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="apps" size={20} color="#0ea5e9" />
            </View>
            <Text style={styles.statValue}>{statsData.total}</Text>
            <Text style={styles.statLabel}>All Recipes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statCard, selectedFilter === 'high' && styles.statCardActive]}
            onPress={() => setSelectedFilter('high')}
          >
            <View style={[styles.statIcon, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            </View>
            <Text style={styles.statValue}>{statsData.high}</Text>
            <Text style={styles.statLabel}>80%+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statCard, selectedFilter === 'medium' && styles.statCardActive]}
            onPress={() => setSelectedFilter('medium')}
          >
            <View style={[styles.statIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="star" size={20} color="#d97706" />
            </View>
            <Text style={styles.statValue}>{statsData.medium}</Text>
            <Text style={styles.statLabel}>60-79%</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statCard, selectedFilter === 'low' && styles.statCardActive]}
            onPress={() => setSelectedFilter('low')}
          >
            <View style={[styles.statIcon, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="star-half" size={20} color="#dc2626" />
            </View>
            <Text style={styles.statValue}>{statsData.low}</Text>
            <Text style={styles.statLabel}>Below 60%</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <View style={styles.searchIconContainer}>
              <Ionicons name="search" size={20} color="#0ea5e9" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#64748b"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.recipesContainer}>
          {filteredRecipes.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="restaurant-outline" size={64} color="#cbd5e1" />
              </View>
              <Text style={styles.emptyStateTitle}>No recipes found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery 
                  ? 'Try a different search term' 
                  : 'Add more ingredients to find matching recipes'}
              </Text>
            </View>
          ) : (
            filteredRecipes.map(result => (
              <TouchableOpacity
                key={result.recipe.id}
                style={styles.recipeCard}
                onPress={() => router.push(`/recipes/${result.recipe.id}` as any)}
              >
                <View style={styles.recipeCardHeader}>
                  <View style={styles.recipeCardImagePlaceholder}>
                    <Ionicons name="restaurant-outline" size={32} color="#0ea5e9" />
                  </View>
                  <View style={styles.recipeMatchBadge}>
                    <LinearGradient
                      colors={getMatchBadgeColors(result.matchPercentage)}
                      style={styles.recipeMatchGradient}
                    >
                      <Text style={styles.recipeMatchPercentage}>{result.matchPercentage}%</Text>
                      <Text style={styles.recipeMatchLabel}>{getMatchLabel(result.matchPercentage)}</Text>
                    </LinearGradient>
                  </View>
                </View>

                <View style={styles.recipeCardBody}>
                  <Text style={styles.recipeCardTitle}>{result.recipe.title}</Text>
                  <Text style={styles.recipeCardDescription} numberOfLines={2}>
                    {result.recipe.description}
                  </Text>

                  <View style={styles.ingredientsMatchSection}>
                    <View style={styles.ingredientsMatchHeader}>
                      <Ionicons name="basket" size={16} color="#0ea5e9" />
                      <Text style={styles.ingredientsMatchTitle}>Ingredients Match</Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBackground}>
                        <LinearGradient
                          colors={getMatchBadgeColors(result.matchPercentage)}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[
                            styles.progressBarFill,
                            { width: `${result.matchPercentage}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.ingredientsMatchText}>
                        {result.matchedIngredients} of {result.totalIngredients} ingredients
                      </Text>
                    </View>
                  </View>

                  <View style={styles.recipeCardStats}>
                    <View style={styles.recipeCardStat}>
                      <Ionicons name="time-outline" size={16} color="#64748b" />
                      <Text style={styles.recipeCardStatText}>{result.recipe.cookTime} min</Text>
                    </View>
                    <View style={styles.recipeCardStat}>
                      <Ionicons name="flame-outline" size={16} color="#64748b" />
                      <Text style={styles.recipeCardStatText}>{result.recipe.difficulty}</Text>
                    </View>
                    <View style={styles.recipeCardStat}>
                      <Ionicons name="people-outline" size={16} color="#64748b" />
                      <Text style={styles.recipeCardStatText}>{result.recipe.servings} servings</Text>
                    </View>
                  </View>

                  <View style={styles.recipeCardTags}>
                    {result.recipe.tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={styles.recipeCardTag}>
                        <Text style={styles.recipeCardTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.recipeCardFooter}>
                  <Text style={styles.viewRecipeText}>View Recipe</Text>
                  <Ionicons name="arrow-forward" size={20} color="#0ea5e9" />
                </View>
              </TouchableOpacity>
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
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
  },
  headerPlaceholder: {
    width: 32,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statCardActive: {
    borderColor: '#0ea5e9',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
  recipesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  recipeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  recipeCardImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeMatchBadge: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeMatchGradient: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  recipeMatchPercentage: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
    marginBottom: 2,
  },
  recipeMatchLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recipeCardBody: {
    marginBottom: 16,
  },
  recipeCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 26,
  },
  recipeCardDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 20,
  },
  ingredientsMatchSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ingredientsMatchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  ingredientsMatchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  progressBarContainer: {
    gap: 6,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  ingredientsMatchText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  recipeCardStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  recipeCardStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recipeCardStatText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  recipeCardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  recipeCardTag: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  recipeCardTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  recipeCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  viewRecipeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0ea5e9',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
});
