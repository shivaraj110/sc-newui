import { useLocalSearchParams, useRouter } from 'expo-router';
import { RecipeDetail } from '../components/RecipeDetail';
import { mockRecipes } from '../data/recipes';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const recipe = mockRecipes.find(r => r.id === id);

  if (!recipe) {
    return null; // Or show error screen
  }

  const handleBack = () => {
    router.back();
  };

  const handleFavoriteToggle = () => {
    // Mock toggle - in real app would update state/database
    console.log('Toggle favorite for recipe:', recipe.id);
  };

  const handleAddToShoppingList = () => {
    // Mock add to shopping list
    console.log('Add ingredients to shopping list for recipe:', recipe.id);
  };

  const handleStartCooking = () => {
    // Mock start cooking - could navigate to cooking mode
    console.log('Start cooking recipe:', recipe.id);
  };

  return (
    <RecipeDetail
      recipe={recipe}
      onBack={handleBack}
      onFavoriteToggle={handleFavoriteToggle}
      onAddToShoppingList={handleAddToShoppingList}
      onStartCooking={handleStartCooking}
    />
  );
}