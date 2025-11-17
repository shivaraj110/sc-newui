import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Recipe } from '../data/recipes';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from './AlertProvider';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack?: () => void;
  onFavoriteToggle?: () => void;
  onAddToShoppingList?: () => void;
  onStartCooking?: () => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onBack,
  onFavoriteToggle,
  onAddToShoppingList,
  onStartCooking,
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  const toggleIngredient = (ingredientId: string) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(ingredientId)) {
      newChecked.delete(ingredientId);
    } else {
      newChecked.add(ingredientId);
    }
    setCheckedIngredients(newChecked);
  };

  const handleAddToShoppingList = () => {
    Alert.confirm(
      'Add to Shopping List',
      'Add all ingredients to your shopping list?',
      onAddToShoppingList
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.header}>
          <ImageBackground
            source={{ uri: recipe.image }}
            style={styles.headerImage}
            imageStyle={styles.headerImageStyle}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.8)']}
              style={styles.headerGradient}
            >
              <View style={styles.headerOverlay}>
                <TouchableOpacity onPress={onBack} style={styles.headerButton}>
                  <View style={styles.headerButtonInner}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                  </View>
                </TouchableOpacity>
                <View style={styles.headerActions}>
                  <TouchableOpacity
                    onPress={() => Alert.success('Share Recipe', 'Recipe shared successfully!')}
                    style={styles.headerButton}
                  >
                    <View style={styles.headerButtonInner}>
                      <Ionicons name="share-outline" size={22} color="white" />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onFavoriteToggle} style={styles.headerButton}>
                    <View style={styles.headerButtonInner}>
                      <Ionicons
                        name={recipe.isFavorite ? "heart" : "heart-outline"}
                        size={24}
                        color={recipe.isFavorite ? "#ef4444" : "white"}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.headerContent}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{recipe.title}</Text>
                  <Text style={styles.description}>{recipe.description}</Text>
                </View>
                
                {recipe.rating && (
                  <View style={styles.ratingContainer}>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={16} color="#fbbf24" />
                      <Text style={styles.ratingText}>{recipe.rating}</Text>
                    </View>
                    <Text style={styles.reviewsText}>({recipe.reviews?.toLocaleString()} reviews)</Text>
                    <View style={styles.difficultyBadge}>
                      <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
                    </View>
                  </View>
                )}
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Recipe Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="time-outline" size={20} color="#d97706" />
            </View>
            <Text style={styles.statValue}>{recipe.cookTime}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="people-outline" size={20} color="#059669" />
            </View>
            <Text style={styles.statValue}>{recipe.servings}</Text>
            <Text style={styles.statLabel}>Servings</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#f3e8ff' }]}>
              <Ionicons name="restaurant-outline" size={20} color="#9333ea" />
            </View>
            <Text style={styles.statValue}>{recipe.difficulty}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#fef2f2' }]}>
              <Ionicons name="flame-outline" size={20} color="#dc2626" />
            </View>
            <Text style={styles.statValue}>{recipe.nutrition.calories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
        </View>

        {/* Tags */}
        <View style={styles.tagsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
            {recipe.tags.map((tag, index) => (
              <LinearGradient
                key={tag}
                colors={tagColors[index % tagColors.length]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tag}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </LinearGradient>
            ))}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={handleAddToShoppingList} style={styles.primaryAction}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              <View style={styles.actionContent}>
                <View style={styles.actionIconContainer}>
                  <Ionicons name="basket" size={22} color="white" />
                </View>
                <Text style={styles.actionText}>Add to List</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={onStartCooking} style={styles.primaryAction}>
            <LinearGradient
              colors={['#f97316', '#ea580c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              <View style={styles.actionContent}>
                <View style={styles.actionIconContainer}>
                  <Ionicons name="play" size={22} color="white" />
                </View>
                <Text style={styles.actionText}>Start Cooking</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{recipe.ingredients.length}</Text>
            </View>
          </View>
          <View style={styles.ingredientsContainer}>
            {recipe.ingredients.map((ingredient, index) => (
              <TouchableOpacity
                key={ingredient.id}
                onPress={() => toggleIngredient(ingredient.id)}
                style={[
                  styles.ingredientCard,
                  checkedIngredients.has(ingredient.id) && styles.ingredientCardChecked
                ]}
              >
                <View style={styles.ingredientLeft}>
                  <View style={styles.checkbox}>
                    {checkedIngredients.has(ingredient.id) ? (
                      <LinearGradient
                        colors={['#10b981', '#059669']}
                        style={styles.checkboxChecked}
                      >
                        <Ionicons name="checkmark" size={14} color="white" />
                      </LinearGradient>
                    ) : (
                      <View style={styles.checkboxUnchecked} />
                    )}
                  </View>
                  <View style={styles.ingredientInfo}>
                    <Text style={[
                      styles.ingredientText,
                      checkedIngredients.has(ingredient.id) && styles.ingredientTextChecked
                    ]}>
                      {ingredient.name}
                    </Text>
                    <Text style={styles.ingredientAmount}>
                      {ingredient.amount} {ingredient.unit}
                    </Text>
                  </View>
                </View>
                <View style={styles.ingredientNumber}>
                  <Text style={styles.ingredientNumberText}>{index + 1}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{recipe.instructions.length}</Text>
            </View>
          </View>
          <View style={styles.instructionsContainer}>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionCard}>
                <LinearGradient
                  colors={['#0ea5e9', '#0284c7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.instructionNumber}
                >
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </LinearGradient>
                <View style={styles.instructionContent}>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Nutrition */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nutrition</Text>
            <View style={[styles.sectionBadge, { backgroundColor: '#10b981' }]}>
              <Text style={styles.sectionBadgeText}>Per Serving</Text>
            </View>
          </View>
          <View style={styles.nutritionCard}>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <LinearGradient
                  colors={['#fbbf24', '#f59e0b']}
                  style={styles.nutritionIcon}
                >
                  <Ionicons name="flame" size={18} color="white" />
                </LinearGradient>
                <Text style={styles.nutritionValue}>{recipe.nutrition.calories}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.nutritionIcon}
                >
                  <Ionicons name="fitness" size={18} color="white" />
                </LinearGradient>
                <Text style={styles.nutritionValue}>{recipe.nutrition.protein}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <LinearGradient
                  colors={['#0ea5e9', '#0284c7']}
                  style={styles.nutritionIcon}
                >
                  <Ionicons name="nutrition" size={18} color="white" />
                </LinearGradient>
                <Text style={styles.nutritionValue}>{recipe.nutrition.carbs}g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  style={styles.nutritionIcon}
                >
                  <Ionicons name="water" size={18} color="white" />
                </LinearGradient>
                <Text style={styles.nutritionValue}>{recipe.nutrition.fat}g</Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const tagColors: [string, string][] = [
  ['#fbbf24', '#f59e0b'],
  ['#10b981', '#059669'],
  ['#ef4444', '#dc2626'],
  ['#a855f7', '#9333ea'],
  ['#06b6d4', '#0891b2'],
  ['#ec4899', '#db2777'],
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: 320,
  },
  headerImage: {
    width: '100%',
    height: 320,
  },
  headerImageStyle: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  headerOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  headerButtonInner: {
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    marginTop: 'auto',
  },
  titleContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    lineHeight: 38,
  },
  description: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 24,
    fontWeight: '400',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '500',
  },
  difficultyBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -30,
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
  },
  statIcon: {
    width: 40,
    height: 40,
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
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  tagsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tagsScroll: {
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 16,
  },
  primaryAction: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  actionGradient: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  actionIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 10,
  },
  actionText: {
    fontSize: 17,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  lastSection: {
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b',
  },
  sectionBadge: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sectionBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: 'white',
  },
  ingredientsContainer: {
    gap: 12,
  },
  ingredientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  ingredientCardChecked: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  ingredientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    marginRight: 16,
  },
  checkboxUnchecked: {
    width: 24,
    height: 24,
    borderWidth: 2.5,
    borderColor: '#e2e8f0',
    borderRadius: 8,
  },
  checkboxChecked: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 22,
    marginBottom: 2,
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  ingredientAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0ea5e9',
  },
  ingredientNumber: {
    backgroundColor: '#f1f5f9',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748b',
  },
  instructionsContainer: {
    gap: 20,
  },
  instructionCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  instructionNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
    flexShrink: 0,
  },
  instructionNumberText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
  },
  instructionContent: {
    flex: 1,
  },
  instructionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
    fontWeight: '500',
  },
  nutritionCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  nutritionItem: {
    flex: 1,
    alignItems: 'center',
  },
  nutritionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '700',
    textAlign: 'center',
  },
});