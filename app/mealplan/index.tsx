import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { mockMealPlan, getMealsForDate } from '../data/mealPlan';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from '../components/AlertProvider';

export default function MealPlanScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('2024-11-18');

  const mealsForDate = getMealsForDate(selectedDate);

  const handleAddMeal = (mealType: string) => {
    Alert.alert(
      `Add ${mealType}`,
      `Would you like to add a recipe to ${mealType.toLowerCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Browse Recipes', 
          onPress: () => router.push('/search')
        },
        { 
          text: 'Create New', 
          onPress: () => router.push('/add-recipe')
        }
      ]
    );
  };

  const handleMealAction = (mealId: string, mealTitle: string) => {
    Alert.alert(
      mealTitle,
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Recipe', onPress: () => console.log(`View recipe for meal ${mealId}`) },
        { text: 'Edit Meal', onPress: () => console.log(`Edit meal ${mealId}`) },
        { text: 'Remove', style: 'destructive', onPress: () => console.log(`Remove meal ${mealId}`) }
      ]
    );
  };

  const handleGenerateShoppingList = () => {
    Alert.confirm(
      'Generate Shopping List',
      'This will create a shopping list based on your meal plan. Continue?',
      () => router.push('/shopping')
    );
  };

  const handleAddPlan = () => {
    Alert.alert(
      'Add to Meal Plan',
      'What would you like to add?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Browse Recipes', onPress: () => router.push('/search') },
        { text: 'Quick Add', onPress: () => handleAddMeal('Quick Meal') }
      ]
    );
  };

  const dates = [
    { date: '2024-11-17', day: 'Sat', display: '17' },
    { date: '2024-11-18', day: 'Sun', display: '18' },
    { date: '2024-11-19', day: 'Mon', display: '19' },
    { date: '2024-11-20', day: 'Tue', display: '20' },
    { date: '2024-11-21', day: 'Wed', display: '21' },
    { date: '2024-11-22', day: 'Thu', display: '22' },
    { date: '2024-11-23', day: 'Fri', display: '23' },
  ];

  const mealTypes = [
    { name: 'Breakfast', icon: 'sunny-outline', colors: ['#fbbf24', '#f59e0b'] },
    { name: 'Lunch', icon: 'restaurant-outline', colors: ['#10b981', '#059669'] },
    { name: 'Dinner', icon: 'moon-outline', colors: ['#a855f7', '#9333ea'] },
    { name: 'Snack', icon: 'cafe-outline', colors: ['#06b6d4', '#0891b2'] },
  ];

  const getMealsByType = (type: string) => {
    return mealsForDate.filter(meal => meal.meal === type);
  };

  const getTotalMeals = () => {
    return mockMealPlan.length;
  };

  const getTotalRecipes = () => {
    const uniqueRecipes = new Set(mockMealPlan.map(meal => meal.recipeId));
    return uniqueRecipes.size;
  };

  const getTotalIngredients = () => {
    return Math.floor(mockMealPlan.length * 2.5);
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
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Ionicons name="calendar" size={28} color="white" />
              <Text style={styles.headerTitle}>Meal Planning</Text>
            </View>
            <TouchableOpacity onPress={handleAddPlan} style={styles.addButton}>
              <View style={styles.addButtonContainer}>
                <Ionicons name="add" size={20} color="#0ea5e9" />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>Plan your week ahead</Text>
        </LinearGradient>

        {/* Date Selector */}
        <View style={styles.dateSection}>
          <Text style={styles.dateSectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateSelector}>
            {dates.map((dateInfo) => (
              <TouchableOpacity
                key={dateInfo.date}
                onPress={() => setSelectedDate(dateInfo.date)}
                style={[styles.dateCard, selectedDate === dateInfo.date && styles.dateCardActive]}
              >
                {selectedDate === dateInfo.date && (
                  <LinearGradient
                    colors={['#0ea5e9', '#0284c7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.dateCardGradient}
                  />
                )}
                <Text style={[styles.dateDay, selectedDate === dateInfo.date && styles.dateDayActive]}>
                  {dateInfo.day}
                </Text>
                <Text style={[styles.dateNumber, selectedDate === dateInfo.date && styles.dateNumberActive]}>
                  {dateInfo.display}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="restaurant" size={16} color="#d97706" />
            </View>
            <Text style={styles.statNumber}>{getTotalMeals()}</Text>
            <Text style={styles.statLabel}>Meals</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="book-outline" size={16} color="#059669" />
            </View>
            <Text style={styles.statNumber}>{getTotalRecipes()}</Text>
            <Text style={styles.statLabel}>Recipes</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="basket-outline" size={16} color="#0284c7" />
            </View>
            <Text style={styles.statNumber}>{getTotalIngredients()}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
        </View>

        {/* Meals */}
        <View style={styles.mealsContainer}>
          {mealTypes.map((mealType) => {
            const meals = getMealsByType(mealType.name);
            return (
              <View key={mealType.name} style={styles.mealSection}>
                <View style={styles.mealHeader}>
                  <View style={styles.mealHeaderLeft}>
                    <LinearGradient
                      colors={mealType.colors as [string, string]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.mealTypeIcon}
                    >
                      <Ionicons name={mealType.icon as any} size={16} color="white" />
                    </LinearGradient>
                    <Text style={styles.mealTypeTitle}>{mealType.name}</Text>
                  </View>
                  <TouchableOpacity style={styles.addMealButton} onPress={() => handleAddMeal(mealType.name)}>
                    <Ionicons name="add-circle-outline" size={20} color="#0ea5e9" />
                  </TouchableOpacity>
                </View>

                {meals.length > 0 ? (
                  meals.map((meal) => (
                    <TouchableOpacity key={meal.id} style={styles.mealCard} onPress={() => handleMealAction(meal.id, meal.recipeTitle)}>
                      <LinearGradient
                        colors={mealType.colors as [string, string]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.mealCardIcon}
                      >
                        <Ionicons name="restaurant" size={16} color="white" />
                      </LinearGradient>
                      <View style={styles.mealInfo}>
                        <Text style={styles.mealTitle}>{meal.recipeTitle}</Text>
                        <Text style={styles.mealMeta}>
                          {meal.servings} serving{meal.servings !== 1 ? 's' : ''} • {selectedDate}
                        </Text>
                      </View>
                      <TouchableOpacity style={styles.mealActionButton} onPress={() => handleMealAction(meal.id, meal.recipeTitle)}>
                        <Ionicons name="ellipsis-horizontal" size={16} color="#64748b" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))
                ) : (
                  <TouchableOpacity style={styles.emptyMealCard} onPress={() => handleAddMeal(mealType.name)}>
                    <View style={styles.emptyMealIcon}>
                      <Ionicons name={mealType.icon as any} size={24} color="#cbd5e1" />
                    </View>
                    <Text style={styles.emptyMealText}>No {mealType.name.toLowerCase()} planned</Text>
                    <Text style={styles.emptyMealSubtext}>Tap to add a recipe</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* Weekly Summary */}
        <View style={[styles.summarySection, styles.lastSection]}>
          <Text style={styles.sectionTitle}>This Week</Text>
          
          <View style={styles.summaryCard}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.summaryGradient}
            >
              <View style={styles.summaryHeader}>
                <View>
                  <Text style={styles.summaryTitle}>Weekly Overview</Text>
                  <Text style={styles.summarySubtitle}>Nov 17 - Nov 23</Text>
                </View>
                <TouchableOpacity style={styles.viewDetailsButton}>
                  <Text style={styles.viewDetailsText}>View All</Text>
                  <Ionicons name="chevron-forward" size={16} color="white" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.summaryStats}>
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatNumber}>{getTotalMeals()}</Text>
                  <Text style={styles.summaryStatLabel}>Planned Meals</Text>
                </View>
                <View style={styles.summaryStatDivider} />
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatNumber}>{getTotalRecipes()}</Text>
                  <Text style={styles.summaryStatLabel}>Unique Recipes</Text>
                </View>
                <View style={styles.summaryStatDivider} />
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatNumber}>{getTotalIngredients()}</Text>
                  <Text style={styles.summaryStatLabel}>Ingredients</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <TouchableOpacity style={styles.shoppingListButton} onPress={handleGenerateShoppingList}>
            <LinearGradient
              colors={['#f97316', '#ea580c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.shoppingListGradient}
            >
              <Ionicons name="basket" size={20} color="white" />
              <Text style={styles.shoppingListText}>Generate Shopping List</Text>
              <Ionicons name="chevron-forward" size={16} color="white" />
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
    paddingBottom: 100,
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
  dateSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  dateSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  dateSelector: {
    marginTop: 4,
  },
  dateCard: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    minWidth: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  dateCardActive: {
    borderColor: '#0ea5e9',
  },
  dateCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dateDay: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
    zIndex: 1,
  },
  dateDayActive: {
    color: 'white',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    zIndex: 1,
  },
  dateNumberActive: {
    color: 'white',
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  mealsContainer: {
    paddingHorizontal: 20,
  },
  mealSection: {
    marginBottom: 24,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mealTypeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  addMealButton: {
    padding: 4,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  mealCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  mealInfo: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  mealMeta: {
    fontSize: 13,
    color: '#64748b',
  },
  mealActionButton: {
    padding: 8,
  },
  emptyMealCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  emptyMealIcon: {
    marginBottom: 12,
  },
  emptyMealText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  emptyMealSubtext: {
    fontSize: 13,
    color: '#94a3b8',
  },
  summarySection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
  },
  summaryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  summaryGradient: {
    padding: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  summaryStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  shoppingListButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  shoppingListGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  shoppingListText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  lastSection: {
    paddingBottom: 100,
  },
});