import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from '../components/AlertProvider';
import { mockMealPlan, MealPlanItem } from '../data/mealPlan';

export default function EditMealScreen() {
  const router = useRouter();
  const { mealId } = useLocalSearchParams();
  
  const [meal, setMeal] = useState<MealPlanItem | null>(null);
  const [servings, setServings] = useState('1');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');

  useEffect(() => {
    const foundMeal = mockMealPlan.find(m => m.id === mealId);
    if (foundMeal) {
      setMeal(foundMeal);
      setServings(foundMeal.servings.toString());
      setSelectedDate(foundMeal.date);
      setSelectedMealType(foundMeal.meal);
    }
  }, [mealId]);

  const mealTypes = ['Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Snack'];

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dates.push({
        value: dateStr,
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${dayName}, ${monthDay}`
      });
    }
    return dates;
  };

  const dateOptions = generateDateOptions();

  const handleSave = () => {
    if (!meal) return;

    Alert.success('Success!', `Updated "${meal.recipeTitle}" in your meal plan`);
    router.back();
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

  if (!meal) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Meal not found</Text>
          <TouchableOpacity style={styles.errorButton} onPress={() => router.back()}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
              <Ionicons name="create-outline" size={28} color="white" />
              <Text style={styles.headerTitle}>Edit Meal</Text>
            </View>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <View style={styles.saveButtonContainer}>
                <Ionicons name="checkmark" size={20} color="#0ea5e9" />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>Update your meal details</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.recipeCard}>
            <LinearGradient
              colors={['#ffffff', '#f8fafc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.recipeCardGradient}
            >
              <View style={styles.recipeHeader}>
                <LinearGradient
                  colors={getMealTypeColor(selectedMealType)}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.recipeIcon}
                >
                  <Ionicons name="restaurant" size={20} color="white" />
                </LinearGradient>
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeTitle}>{meal.recipeTitle}</Text>
                  <Text style={styles.recipeSubtitle}>Recipe ID: {meal.recipeId}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Servings</Text>
            <View style={styles.servingsContainer}>
              <TouchableOpacity 
                style={styles.servingsButton}
                onPress={() => setServings(Math.max(1, parseInt(servings) - 1).toString())}
              >
                <Ionicons name="remove" size={20} color="#64748b" />
              </TouchableOpacity>
              <TextInput
                style={styles.servingsInput}
                value={servings}
                onChangeText={setServings}
                keyboardType="numeric"
                textAlign="center"
              />
              <TouchableOpacity 
                style={styles.servingsButton}
                onPress={() => setServings((parseInt(servings) + 1).toString())}
              >
                <Ionicons name="add" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Meal Type</Text>
            <View style={styles.mealTypesGrid}>
              {mealTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.mealTypeCard, selectedMealType === type && styles.mealTypeCardActive]}
                  onPress={() => setSelectedMealType(type)}
                >
                  {selectedMealType === type && (
                    <LinearGradient
                      colors={getMealTypeColor(type)}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.mealTypeCardGradient}
                    />
                  )}
                  <Ionicons 
                    name={getMealTypeIcon(type) as any} 
                    size={20} 
                    color={selectedMealType === type ? 'white' : '#64748b'} 
                    style={styles.mealTypeIcon}
                  />
                  <Text style={[styles.mealTypeText, selectedMealType === type && styles.mealTypeTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Date</Text>
            <View style={styles.dateContainer}>
              {dateOptions.map((dateOption) => (
                <TouchableOpacity
                  key={dateOption.value}
                  style={[styles.dateCard, selectedDate === dateOption.value && styles.dateCardActive]}
                  onPress={() => setSelectedDate(dateOption.value)}
                >
                  {selectedDate === dateOption.value && (
                    <LinearGradient
                      colors={['#0ea5e9', '#0284c7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.dateCardGradient}
                    />
                  )}
                  <Text style={[styles.dateText, selectedDate === dateOption.value && styles.dateTextActive]}>
                    {dateOption.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.saveButtonLarge} onPress={handleSave}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButtonLargeGradient}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
  saveButton: {
    padding: 4,
  },
  saveButtonContainer: {
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
  recipeCard: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  recipeCardGradient: {
    padding: 16,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  recipeSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  servingsButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  servingsInput: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginHorizontal: 20,
    minWidth: 50,
    textAlign: 'center',
  },
  mealTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mealTypeCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mealTypeCardActive: {
    borderColor: '#0ea5e9',
  },
  mealTypeCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mealTypeIcon: {
    marginRight: 8,
    zIndex: 1,
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    zIndex: 1,
  },
  mealTypeTextActive: {
    color: 'white',
  },
  dateContainer: {
    gap: 8,
  },
  dateCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
    zIndex: 1,
  },
  dateTextActive: {
    color: 'white',
  },
  saveButtonLarge: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  saveButtonLargeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 16,
  },
  errorButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});