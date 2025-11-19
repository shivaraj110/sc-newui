import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from '../components/AlertProvider';
import { mockRecipes } from '../data/recipes';

export default function MealPlanPreviewScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams();
  
  const mockMealPlanDetails = {
    id: planId,
    title: 'Healthy Week Prep',
    description: 'A balanced meal plan for busy weekdays',
    duration: '7 days',
    meals: 21,
    difficulty: 'Easy',
    type: 'Healthy',
    calories: '1800-2000',
    tags: ['Low Carb', 'High Protein', 'Gluten Free'],
    author: 'Chef Maria',
    rating: 4.8,
    image: '🥗',
    schedule: [
      {
        day: 'Monday',
        date: '2024-11-18',
        meals: [
          { type: 'Breakfast', recipe: mockRecipes[3], servings: 1 },
          { type: 'Lunch', recipe: mockRecipes[1], servings: 2 },
          { type: 'Dinner', recipe: mockRecipes[0], servings: 4 },
          { type: 'Snack', recipe: mockRecipes[6], servings: 1 },
        ]
      },
      {
        day: 'Tuesday', 
        date: '2024-11-19',
        meals: [
          { type: 'Breakfast', recipe: mockRecipes[6], servings: 1 },
          { type: 'Lunch', recipe: mockRecipes[5], servings: 2 },
          { type: 'Dinner', recipe: mockRecipes[4], servings: 4 },
        ]
      },
      {
        day: 'Wednesday',
        date: '2024-11-20', 
        meals: [
          { type: 'Breakfast', recipe: mockRecipes[3], servings: 1 },
          { type: 'Lunch', recipe: mockRecipes[1], servings: 2 },
          { type: 'Dinner', recipe: mockRecipes[7], servings: 4 },
        ]
      }
    ]
  };

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'Breakfast': return 'sunny-outline';
      case 'Brunch': return 'cafe-outline';
      case 'Lunch': return 'restaurant-outline';
      case 'Dinner': return 'moon-outline';
      case 'Snack': return 'cafe-outline';
      default: return 'restaurant-outline';
    }
  };

  const getMealTypeColor = (type: string): [string, string] => {
    switch (type) {
      case 'Breakfast': return ['#fbbf24', '#f59e0b'];
      case 'Brunch': return ['#06b6d4', '#0891b2'];
      case 'Lunch': return ['#10b981', '#059669'];
      case 'Dinner': return ['#a855f7', '#9333ea'];
      case 'Snack': return ['#06b6d4', '#0891b2'];
      default: return ['#64748b', '#475569'];
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#64748b';
    }
  };

  const handleAddPlan = () => {
    Alert.success('Added!', `"${mockMealPlanDetails.title}" has been added to your meal plans`);
  };

  const handleViewRecipe = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
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
              <Ionicons name="eye-outline" size={28} color="white" />
              <Text style={styles.headerTitle}>Plan Preview</Text>
            </View>
            <TouchableOpacity onPress={handleAddPlan} style={styles.addButton}>
              <View style={styles.addButtonContainer}>
                <Ionicons name="add" size={20} color="#0ea5e9" />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>Review before adding to your plans</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.planOverview}>
            <LinearGradient
              colors={['#ffffff', '#f8fafc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.planOverviewGradient}
            >
              <View style={styles.planHeader}>
                <View style={styles.planIconContainer}>
                  <Text style={styles.planIcon}>{mockMealPlanDetails.image}</Text>
                </View>
                <View style={styles.planHeaderInfo}>
                  <Text style={styles.planTitle}>{mockMealPlanDetails.title}</Text>
                  <Text style={styles.planAuthor}>by {mockMealPlanDetails.author}</Text>
                </View>
                <View style={styles.planRating}>
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Text style={styles.ratingText}>{mockMealPlanDetails.rating}</Text>
                </View>
              </View>

              <Text style={styles.planDescription}>{mockMealPlanDetails.description}</Text>

              <View style={styles.planStats}>
                <View style={styles.planStatItem}>
                  <Ionicons name="time-outline" size={14} color="#64748b" />
                  <Text style={styles.planStatText}>{mockMealPlanDetails.duration}</Text>
                </View>
                <View style={styles.planStatItem}>
                  <Ionicons name="restaurant-outline" size={14} color="#64748b" />
                  <Text style={styles.planStatText}>{mockMealPlanDetails.meals} meals</Text>
                </View>
                <View style={styles.planStatItem}>
                  <Ionicons name="flame-outline" size={14} color="#64748b" />
                  <Text style={styles.planStatText}>{mockMealPlanDetails.calories}</Text>
                </View>
              </View>

              <View style={styles.planMeta}>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(mockMealPlanDetails.difficulty) + '20' }]}>
                  <Text style={[styles.difficultyText, { color: getDifficultyColor(mockMealPlanDetails.difficulty) }]}>
                    {mockMealPlanDetails.difficulty}
                  </Text>
                </View>
              </View>

              <View style={styles.planTags}>
                {mockMealPlanDetails.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>

          <View style={styles.scheduleSection}>
            <Text style={styles.sectionTitle}>Meal Schedule</Text>
            
            {mockMealPlanDetails.schedule.map((daySchedule, dayIndex) => (
              <View key={dayIndex} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayName}>{daySchedule.day}</Text>
                  <Text style={styles.dayDate}>{daySchedule.date}</Text>
                </View>
                
                {daySchedule.meals.map((meal, mealIndex) => (
                  <TouchableOpacity 
                    key={mealIndex} 
                    style={styles.mealItem}
                    onPress={() => handleViewRecipe(meal.recipe.id)}
                  >
                    <LinearGradient
                      colors={getMealTypeColor(meal.type)}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.mealTypeIcon}
                    >
                      <Ionicons 
                        name={getMealTypeIcon(meal.type) as any} 
                        size={16} 
                        color="white" 
                      />
                    </LinearGradient>
                    
                    <View style={styles.mealInfo}>
                      <Text style={styles.mealType}>{meal.type}</Text>
                      <Text style={styles.mealName}>{meal.recipe.title}</Text>
                      <Text style={styles.mealServings}>{meal.servings} serving{meal.servings !== 1 ? 's' : ''}</Text>
                    </View>
                    
                    <TouchableOpacity style={styles.mealAction}>
                      <Ionicons name="chevron-forward" size={16} color="#64748b" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.addPlanButton} onPress={handleAddPlan}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addPlanButtonGradient}
            >
              <Ionicons name="add-circle" size={20} color="white" />
              <Text style={styles.addPlanButtonText}>Add to My Plans</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  addButton: {
    padding: 4,
  },
  addButtonContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  planOverview: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  planOverviewGradient: {
    padding: 20,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  planIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  planIcon: {
    fontSize: 24,
  },
  planHeaderInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  planAuthor: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  planRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#d97706',
  },
  planDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  planStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  planStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  planStatText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  planMeta: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  planTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: '#0284c7',
    fontWeight: '600',
  },
  scheduleSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
  },
  dayCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  dayName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  dayDate: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  mealTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
  },
  mealName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  mealServings: {
    fontSize: 12,
    color: '#64748b',
  },
  mealAction: {
    padding: 8,
  },
  addPlanButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  addPlanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  addPlanButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});