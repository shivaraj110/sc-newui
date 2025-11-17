import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { mockRecipes } from "../data/recipes";
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from '../components/AlertProvider';

export default function FavoritesScreen() {
  const router = useRouter();

  const favoriteRecipes = mockRecipes.filter(recipe => recipe.isFavorite);

  const handleRecipePress = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
  };

  const handleFavoriteToggle = (recipeId: string, currentlyFavorite: boolean) => {
    if (currentlyFavorite) {
      Alert.confirm(
        'Remove from Favorites',
        'Are you sure you want to remove this recipe from favorites?',
        () => Alert.success('Removed!', 'Recipe removed from favorites')
      );
    } else {
      Alert.success('Added!', 'Recipe added to favorites');
    }
  };

  const handleCollectionPress = (collection: string) => {
    Alert.alert(`${collection} Collection`, `Opening ${collection.toLowerCase()} collection...`, undefined, { type: 'info' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#ec4899', '#db2777']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Ionicons name="heart" size={32} color="white" />
          <Text style={styles.headerTitle}>My Favorites</Text>
          <Text style={styles.headerSubtitle}>{favoriteRecipes.length} saved recipes</Text>
        </LinearGradient>

        {favoriteRecipes.length > 0 ? (
          <View style={styles.recipesSection}>
            {favoriteRecipes.map((recipe) => (
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
                      <Ionicons name="heart" size={20} color="#ec4899" />
                    </TouchableOpacity>
                  </View>
                  
                  {recipe.rating && (
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={14} color="#fbbf24" />
                      <Text style={styles.ratingText}>{recipe.rating}</Text>
                      <Text style={styles.reviewText}>({recipe.reviews?.toLocaleString()})</Text>
                    </View>
                  )}
                  
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={14} color="#64748b" />
                      <Text style={styles.metaText}>{recipe.cookTime} min</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="people-outline" size={14} color="#64748b" />
                      <Text style={styles.metaText}>{recipe.servings} servings</Text>
                    </View>
                  </View>
                  
                  <View style={styles.tagsRow}>
                    {recipe.tags.slice(0, 2).map((tag) => (
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
            <View style={styles.emptyIconContainer}>
              <Ionicons name="heart-outline" size={80} color="#e2e8f0" />
            </View>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>
              Start saving recipes you love by tapping the heart icon
            </Text>
            <TouchableOpacity style={styles.explorButton} onPress={() => router.push('/search')}>
              <LinearGradient
                colors={['#ec4899', '#db2777']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.exploreGradient}
              >
                <Ionicons name="search" size={20} color="white" />
                <Text style={styles.exploreText}>Explore Recipes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Collections */}
        <View style={[styles.collectionsSection, styles.lastSection]}>
          <Text style={styles.sectionTitle}>My Collections</Text>
          
          <TouchableOpacity style={styles.collectionCard} onPress={() => handleCollectionPress('Quick Meals')}>
            <LinearGradient
              colors={['#f97316', '#ea580c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.collectionGradient}
            >
              <View style={styles.collectionIcon}>
                <Ionicons name="flash" size={28} color="white" />
              </View>
              <View style={styles.collectionInfo}>
                <Text style={styles.collectionTitle}>Quick Meals</Text>
                <Text style={styles.collectionSubtitle}>Under 30 minutes</Text>
              </View>
              <View style={styles.collectionBadge}>
                <Text style={styles.collectionCount}>3</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.collectionCard} onPress={() => handleCollectionPress('Healthy Options')}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.collectionGradient}
            >
              <View style={styles.collectionIcon}>
                <Ionicons name="leaf" size={28} color="white" />
              </View>
              <View style={styles.collectionInfo}>
                <Text style={styles.collectionTitle}>Healthy Options</Text>
                <Text style={styles.collectionSubtitle}>Low calorie recipes</Text>
              </View>
              <View style={styles.collectionBadge}>
                <Text style={styles.collectionCount}>2</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.collectionCard} onPress={() => handleCollectionPress('Weekend Specials')}>
            <LinearGradient
              colors={['#a855f7', '#9333ea']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.collectionGradient}
            >
              <View style={styles.collectionIcon}>
                <Ionicons name="restaurant" size={28} color="white" />
              </View>
              <View style={styles.collectionInfo}>
                <Text style={styles.collectionTitle}>Weekend Specials</Text>
                <Text style={styles.collectionSubtitle}>For special occasions</Text>
              </View>
              <View style={styles.collectionBadge}>
                <Text style={styles.collectionCount}>5</Text>
              </View>
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
  recipesSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  metaRow: {
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
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 8,
  },
  tagText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  explorButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  exploreGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 8,
  },
  exploreText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  collectionsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
  },
  collectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  collectionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  collectionIcon: {
    marginRight: 16,
  },
  collectionInfo: {
    flex: 1,
  },
  collectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  collectionSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  collectionBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  collectionCount: {
    fontSize: 14,
    fontWeight: '800',
    color: 'white',
  },
  lastSection: {
    paddingBottom: 100,
  },
});