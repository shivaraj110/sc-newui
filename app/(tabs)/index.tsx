import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { mockRecipes, categories } from "../data/recipes";
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const featuredRecipes = mockRecipes.slice(0, 3);

  const handleRecipePress = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
  };

  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: '/search',
      params: { category: category }
    });
  };

  const handleFavoriteToggle = (recipeId: string) => {
    // Toggle favorite status
    console.log(`Toggling favorite for recipe ${recipeId}`);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'scan':
        router.push('/scan');
        break;
      case 'shopping':
        router.push('/shopping');
        break;
      case 'mealplan':
        router.push('/mealplan');
        break;
      case 'timer':
        router.push('/timer');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#0ea5e9', '#0284c7', '#0369a1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Welcome back! 👋</Text>
              <Text style={styles.appName}>ShelfCook</Text>
              <Text style={styles.headerSubtitle}>What would you like to cook today?</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <View style={styles.profileIconContainer}>
                <Ionicons name="person" size={24} color="#0ea5e9" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/search')}>
            <View style={styles.searchIconContainer}>
              <Ionicons name="search" size={20} color="#0ea5e9" />
            </View>
            <Text style={styles.searchText}>Search recipes, ingredients...</Text>
            <View style={styles.micIconContainer}>
              <Ionicons name="mic" size={18} color="#0ea5e9" />
            </View>
          </TouchableOpacity>
        </LinearGradient>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Categories</Text>
            <Ionicons name="chevron-forward" size={20} color="#0ea5e9" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.slice(0, 6).map((category, index) => (
              <TouchableOpacity 
                key={category} 
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
              >
                <LinearGradient
                  colors={categoryGradients[index % categoryGradients.length]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryGradient}
                >
                  <Ionicons name={categoryIcons[index % categoryIcons.length] as any} size={28} color="white" />
                  <Text style={styles.categoryText}>{category}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Recipes */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Recipes</Text>
              <TouchableOpacity onPress={() => router.push('/search')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

          {featuredRecipes.map((recipe, index) => (
            <TouchableOpacity
              key={recipe.id}
              onPress={() => handleRecipePress(recipe.id)}
              style={[styles.recipeCard, index === 0 && styles.recipeCardFirst]}
            >
              <ImageBackground
                source={{ uri: recipe.image }}
                style={styles.recipeImageBg}
                imageStyle={styles.recipeImageStyle}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.recipeGradient}
                >
                  <TouchableOpacity 
                    style={styles.favoriteButton}
                    onPress={() => handleFavoriteToggle(recipe.id)}
                  >
                    <Ionicons
                      name={recipe.isFavorite ? "heart" : "heart-outline"}
                      size={22}
                      color={recipe.isFavorite ? "#ef4444" : "white"}
                    />
                  </TouchableOpacity>
                  
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    
                    {recipe.rating && (
                      <View style={styles.ratingContainer}>
                        <View style={styles.ratingBadge}>
                          <Ionicons name="star" size={12} color="#fbbf24" />
                          <Text style={styles.ratingText}>{recipe.rating}</Text>
                        </View>
                        <Text style={styles.reviewsText}>({recipe.reviews?.toLocaleString()} reviews)</Text>
                      </View>
                    )}

                    <View style={styles.recipeMetaRow}>
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={16} color="white" />
                        <Text style={styles.metaText}>{recipe.cookTime} min</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="people-outline" size={16} color="white" />
                        <Text style={styles.metaText}>{recipe.servings} servings</Text>
                      </View>
                      <View style={styles.difficultyBadge}>
                        <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
                      </View>
                    </View>

                    <View style={styles.tagsContainer}>
                      {recipe.tags.slice(0, 2).map((tag) => (
                        <View key={tag} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              onPress={() => handleQuickAction('scan')}
              style={styles.quickActionCard}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name="camera" size={28} color="white" />
                </View>
                <Text style={styles.quickActionText}>Scan{'\n'}Ingredients</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleQuickAction('shopping')}
              style={styles.quickActionCard}
            >
              <LinearGradient
                colors={['#f97316', '#ea580c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name="basket-outline" size={28} color="white" />
                </View>
                <Text style={styles.quickActionText}>Shopping{'\n'}List</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleQuickAction('mealplan')}
              style={styles.quickActionCard}
            >
              <LinearGradient
                colors={['#a855f7', '#9333ea']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name="calendar-outline" size={28} color="white" />
                </View>
                <Text style={styles.quickActionText}>Meal{'\n'}Planning</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleQuickAction('timer')}
              style={styles.quickActionCard}
            >
              <LinearGradient
                colors={['#06b6d4', '#0891b2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name="timer-outline" size={28} color="white" />
                </View>
                <Text style={styles.quickActionText}>Cooking{'\n'}Timer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
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
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  profileButton: {
    padding: 4,
  },
  profileIconContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  searchBar: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  searchIconContainer: {
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    padding: 8,
    marginRight: 12,
  },
  searchText: {
    flex: 1,
    color: '#64748b',
    fontSize: 15,
  },
  micIconContainer: {
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    padding: 8,
  },
  section: {
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
  },
  seeAllText: {
    fontSize: 15,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  categoriesContainer: {
    marginTop: 4,
  },
  categoryCard: {
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryGradient: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
    marginTop: 8,
  },
  recipeCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  recipeCardFirst: {
    marginTop: 8,
  },
  recipeImageBg: {
    width: '100%',
    height: 240,
  },
  recipeImageStyle: {
    borderRadius: 20,
  },
  recipeGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  recipeInfo: {
    marginTop: 'auto',
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '500',
  },
  recipeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  metaText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 6,
    fontWeight: '600',
  },
  difficultyBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '700',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  tagText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  favoriteButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  quickActionCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  quickActionIcon: {
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    lineHeight: 18,
  },
  lastSection: {
    paddingBottom: 100,
  },
});
