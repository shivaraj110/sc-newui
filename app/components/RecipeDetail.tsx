import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Recipe } from '../data/recipes';
import { LinearGradient } from 'expo-linear-gradient';

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
    Alert.alert(
      'Add to Shopping List',
      'Add all ingredients to your shopping list?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', onPress: onAddToShoppingList },
      ]
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
              colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.7)']}
              style={styles.headerGradient}
            >
              <View style={styles.headerOverlay}>
                <TouchableOpacity onPress={onBack} style={styles.headerButton}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onFavoriteToggle} style={styles.headerButton}>
                  <Ionicons
                    name={recipe.isFavorite ? "heart" : "heart-outline"}
                    size={24}
                    color={recipe.isFavorite ? "#ef4444" : "white"}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.headerContent}>
                <Text style={styles.title}>{recipe.title}</Text>
                <Text style={styles.description}>{recipe.description}</Text>
                
                {recipe.rating && (
                  <View style={styles.ratingContainer}>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={14} color="#fbbf24" />
                      <Text style={styles.ratingText}>{recipe.rating}</Text>
                    </View>
                    <Text style={styles.reviewsText}>({recipe.reviews?.toLocaleString()} reviews)</Text>
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
              <Ionicons name="basket" size={20} color="white" />
              <Text style={styles.actionText}>Add to List</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={onStartCooking} style={styles.primaryAction}>
            <LinearGradient
              colors={['#f97316', '#ea580c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              <Ionicons name="play" size={20} color="white" />
              <Text style={styles.actionText}>Start Cooking</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert('Share Recipe', 'Recipe shared successfully!')}
            style={styles.secondaryAction}
          >
            <View style={styles.shareButton}>
              <Ionicons name="share-outline" size={20} color="#0ea5e9" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients ({recipe.ingredients.length})</Text>
          <View style={styles.ingredientsContainer}>
            {recipe.ingredients.map((ingredient) => (
              <TouchableOpacity
                key={ingredient.id}
                onPress={() => toggleIngredient(ingredient.id)}
                style={[
                  styles.ingredientCard,
                  checkedIngredients.has(ingredient.id) && styles.ingredientCardChecked
                ]}
              >
                <View style={styles.checkbox}>
                  {checkedIngredients.has(ingredient.id) ? (
                    <View style={styles.checkboxChecked}>
                      <Ionicons name="checkmark" size={12} color="white" />
                    </View>
                  ) : (
                    <View style={styles.checkboxUnchecked} />
                  )}
                </View>
                <Text style={[
                  styles.ingredientText,
                  checkedIngredients.has(ingredient.id) && styles.ingredientTextChecked
                ]}>
                  <Text style={styles.ingredientAmount}>
                    {ingredient.amount} {ingredient.unit}
                  </Text>
                  {' '}{ingredient.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions ({recipe.instructions.length} steps)</Text>
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
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Nutrition */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Nutrition (per serving)</Text>
          <View style={styles.nutritionCard}>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <View style={[styles.nutritionIcon, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="flame" size={16} color="#d97706" />
                </View>
                <Text style={styles.nutritionValue}>{recipe.nutrition.calories}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <View style={[styles.nutritionIcon, { backgroundColor: '#ecfdf5' }]}>
                  <Ionicons name="fitness" size={16} color="#059669" />
                </View>
                <Text style={styles.nutritionValue}>{recipe.nutrition.protein}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <View style={[styles.nutritionIcon, { backgroundColor: '#e0f2fe' }]}>
                  <Ionicons name="nutrition" size={16} color="#0284c7" />
                </View>
                <Text style={styles.nutritionValue}>{recipe.nutrition.carbs}g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <View style={[styles.nutritionIcon, { backgroundColor: '#fef2f2' }]}>
                  <Ionicons name="water" size={16} color="#dc2626" />
                </View>
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
  headerButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    padding: 12,
    borderRadius: 16,
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    marginTop: 'auto',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 22,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '500',
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
    gap: 12,
  },
  primaryAction: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  secondaryAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  lastSection: {
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
  },
  ingredientsContainer: {
    gap: 8,
  },
  ingredientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ingredientCardChecked: {
    backgroundColor: '#f1f5f9',
  },
  checkbox: {
    marginRight: 16,
  },
  checkboxUnchecked: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 6,
  },
  checkboxChecked: {
    width: 20,
    height: 20,
    backgroundColor: '#10b981',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 22,
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  ingredientAmount: {
    fontWeight: '700',
    color: '#0ea5e9',
  },
  instructionsContainer: {
    gap: 16,
  },
  instructionCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    flexShrink: 0,
  },
  instructionNumberText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  nutritionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    flex: 1,
    alignItems: 'center',
  },
  nutritionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
});