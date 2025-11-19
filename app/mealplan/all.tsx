import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from '../components/AlertProvider';

export default function AllMealPlansScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const mockMealPlans = [
    {
      id: '1',
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
      image: '🥗'
    },
    {
      id: '2',
      title: 'Mediterranean Delight',
      description: 'Fresh, flavorful Mediterranean cuisine',
      duration: '5 days',
      meals: 15,
      difficulty: 'Medium',
      type: 'Mediterranean',
      calories: '1900-2100',
      tags: ['Heart Healthy', 'Olive Oil', 'Fresh Herbs'],
      author: 'Chef Antonio',
      rating: 4.9,
      image: '🍅'
    },
    {
      id: '3',
      title: 'Quick & Easy',
      description: '30-minute meals for busy families',
      duration: '7 days',
      meals: 21,
      difficulty: 'Easy',
      type: 'Quick',
      calories: '1700-1900',
      tags: ['30 Min', 'Family Friendly', 'Budget'],
      author: 'Chef Sarah',
      rating: 4.7,
      image: '⚡'
    },
    {
      id: '4',
      title: 'Vegetarian Paradise',
      description: 'Plant-based meals full of flavor',
      duration: '7 days',
      meals: 21,
      difficulty: 'Medium',
      type: 'Vegetarian',
      calories: '1600-1800',
      tags: ['Plant Based', 'High Fiber', 'Colorful'],
      author: 'Chef Green',
      rating: 4.6,
      image: '🥬'
    },
    {
      id: '5',
      title: 'Keto Kickstart',
      description: 'Low-carb, high-fat ketogenic meals',
      duration: '14 days',
      meals: 42,
      difficulty: 'Hard',
      type: 'Keto',
      calories: '1500-1700',
      tags: ['Low Carb', 'High Fat', 'Ketosis'],
      author: 'Dr. Keto',
      rating: 4.5,
      image: '🥑'
    },
    {
      id: '6',
      title: 'Asian Fusion',
      description: 'Explore flavors from across Asia',
      duration: '10 days',
      meals: 30,
      difficulty: 'Medium',
      type: 'Asian',
      calories: '1800-2000',
      tags: ['Authentic', 'Spicy', 'Umami'],
      author: 'Chef Lin',
      rating: 4.8,
      image: '🍜'
    },
    {
      id: '7',
      title: 'Comfort Food Classics',
      description: 'Healthy twists on comfort foods',
      duration: '7 days',
      meals: 21,
      difficulty: 'Easy',
      type: 'Comfort',
      calories: '2000-2200',
      tags: ['Comfort', 'Satisfying', 'Family'],
      author: 'Chef Home',
      rating: 4.4,
      image: '🍲'
    },
    {
      id: '8',
      title: 'Athlete Fuel',
      description: 'High-performance nutrition for active lifestyles',
      duration: '7 days',
      meals: 28,
      difficulty: 'Medium',
      type: 'Sports',
      calories: '2500-2800',
      tags: ['High Protein', 'Energy', 'Recovery'],
      author: 'Coach Fit',
      rating: 4.9,
      image: '💪'
    }
  ];

  const filters = ['All', 'Healthy', 'Quick', 'Vegetarian', 'Mediterranean', 'Keto'];

  const filteredPlans = selectedFilter === 'All' 
    ? mockMealPlans 
    : mockMealPlans.filter(plan => plan.type === selectedFilter);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#64748b';
    }
  };

  const handlePlanAction = (planId: string, planTitle: string) => {
    Alert.alert(
      planTitle,
      'What would you like to do with this meal plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Details', onPress: () => router.push({
          pathname: '/mealplan/preview',
          params: { planId: planId }
        }) },
        { text: 'Add to My Plans', onPress: () => {
          Alert.success('Success!', `Added "${planTitle}" to your meal plans`);
        }},
        { text: 'Preview Meals', onPress: () => router.push({
          pathname: '/mealplan/preview',
          params: { planId: planId }
        }) }
      ]
    );
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
              <Ionicons name="restaurant" size={28} color="white" />
              <Text style={styles.headerTitle}>All Meal Plans</Text>
            </View>
            <TouchableOpacity style={styles.searchButton}>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>Discover new meal plans for every lifestyle</Text>
        </LinearGradient>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={[styles.filterChip, selectedFilter === filter && styles.filterChipActive]}
              >
                {selectedFilter === filter && (
                  <LinearGradient
                    colors={['#0ea5e9', '#0284c7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.filterChipGradient}
                  />
                )}
                <Text style={[styles.filterChipText, selectedFilter === filter && styles.filterChipTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredPlans.length}</Text>
            <Text style={styles.statLabel}>Meal Plans</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredPlans.reduce((sum, plan) => sum + plan.meals, 0)}</Text>
            <Text style={styles.statLabel}>Total Meals</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{Math.round(filteredPlans.reduce((sum, plan) => sum + plan.rating, 0) / filteredPlans.length * 10) / 10}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>

        {/* Meal Plans Grid */}
        <View style={styles.plansContainer}>
          <Text style={styles.sectionTitle}>
            {selectedFilter === 'All' ? 'All Meal Plans' : `${selectedFilter} Meal Plans`} ({filteredPlans.length})
          </Text>
          
          {filteredPlans.map((plan) => (
            <TouchableOpacity 
              key={plan.id} 
              style={styles.planCard}
              onPress={() => handlePlanAction(plan.id, plan.title)}
            >
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.planCardGradient}
              >
                {/* Plan Header */}
                <View style={styles.planHeader}>
                  <View style={styles.planIconContainer}>
                    <Text style={styles.planIcon}>{plan.image}</Text>
                  </View>
                  <View style={styles.planHeaderInfo}>
                    <Text style={styles.planTitle}>{plan.title}</Text>
                    <Text style={styles.planAuthor}>by {plan.author}</Text>
                  </View>
                  <View style={styles.planRating}>
                    <Ionicons name="star" size={14} color="#f59e0b" />
                    <Text style={styles.ratingText}>{plan.rating}</Text>
                  </View>
                </View>

                {/* Plan Description */}
                <Text style={styles.planDescription}>{plan.description}</Text>

                {/* Plan Stats */}
                <View style={styles.planStats}>
                  <View style={styles.planStatItem}>
                    <Ionicons name="time-outline" size={14} color="#64748b" />
                    <Text style={styles.planStatText}>{plan.duration}</Text>
                  </View>
                  <View style={styles.planStatItem}>
                    <Ionicons name="restaurant-outline" size={14} color="#64748b" />
                    <Text style={styles.planStatText}>{plan.meals} meals</Text>
                  </View>
                  <View style={styles.planStatItem}>
                    <Ionicons name="flame-outline" size={14} color="#64748b" />
                    <Text style={styles.planStatText}>{plan.calories}</Text>
                  </View>
                </View>

                {/* Difficulty Badge */}
                <View style={styles.planMeta}>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(plan.difficulty) + '20' }]}>
                    <Text style={[styles.difficultyText, { color: getDifficultyColor(plan.difficulty) }]}>
                      {plan.difficulty}
                    </Text>
                  </View>
                </View>

                {/* Tags */}
                <View style={styles.planTags}>
                  {plan.tags.slice(0, 3).map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                  {plan.tags.length > 3 && (
                    <Text style={styles.moreTagsText}>+{plan.tags.length - 3} more</Text>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={styles.planActions}>
                  <TouchableOpacity 
                    style={styles.previewButton}
                    onPress={() => router.push({
                      pathname: '/mealplan/preview',
                      params: { planId: plan.id }
                    })}
                  >
                    <Ionicons name="eye-outline" size={16} color="#0ea5e9" />
                    <Text style={styles.previewButtonText}>Preview</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => {
                      Alert.success('Added!', `"${plan.title}" added to your meal plans`);
                    }}
                  >
                    <LinearGradient
                      colors={['#10b981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.addButtonGradient}
                    >
                      <Ionicons name="add" size={16} color="white" />
                      <Text style={styles.addButtonText}>Add Plan</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  searchButton: {
    padding: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  filterScroll: {
    marginTop: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    position: 'relative',
  },
  filterChipActive: {
    borderColor: '#0ea5e9',
  },
  filterChipGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    zIndex: 1,
  },
  filterChipTextActive: {
    color: 'white',
  },
  statsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
  },
  plansContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
  },
  planCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  planCardGradient: {
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
    marginBottom: 16,
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
  moreTagsText: {
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  planActions: {
    flexDirection: 'row',
    gap: 12,
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f2fe',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  addButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  bottomSpacing: {
    height: 100,
  },
});