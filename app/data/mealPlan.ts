export interface MealPlanItem {
  id: string;
  date: string; // YYYY-MM-DD
  meal: 'Breakfast' | 'Brunch' | 'Lunch' | 'Dinner' | 'Snack';
  recipeId: string;
  recipeTitle: string;
  servings: number;
}

export const mockMealPlan: MealPlanItem[] = [
  // Monday
  {
    id: '1',
    date: '2024-11-18',
    meal: 'Breakfast',
    recipeId: '4',
    recipeTitle: 'Smoked Salmon Avocado Toast',
    servings: 1,
  },
  {
    id: '2',
    date: '2024-11-18',
    meal: 'Lunch',
    recipeId: '2',
    recipeTitle: 'Mediterranean Quinoa Bowl',
    servings: 2,
  },
  {
    id: '3',
    date: '2024-11-18',
    meal: 'Dinner',
    recipeId: '1',
    recipeTitle: 'Creamy Tuscan Chicken',
    servings: 4,
  },
  {
    id: '4',
    date: '2024-11-18',
    meal: 'Snack',
    recipeId: '7',
    recipeTitle: 'Berry Smoothie Bowl',
    servings: 1,
  },

  // Tuesday
  {
    id: '5',
    date: '2024-11-19',
    meal: 'Breakfast',
    recipeId: '7',
    recipeTitle: 'Berry Smoothie Bowl',
    servings: 1,
  },
  {
    id: '6',
    date: '2024-11-19',
    meal: 'Lunch',
    recipeId: '6',
    recipeTitle: 'Mushroom Risotto',
    servings: 2,
  },
  {
    id: '7',
    date: '2024-11-19',
    meal: 'Dinner',
    recipeId: '5',
    recipeTitle: 'Thai Green Curry',
    servings: 4,
  },

  // Wednesday
  {
    id: '8',
    date: '2024-11-20',
    meal: 'Breakfast',
    recipeId: '4',
    recipeTitle: 'Smoked Salmon Avocado Toast',
    servings: 1,
  },
  {
    id: '9',
    date: '2024-11-20',
    meal: 'Lunch',
    recipeId: '2',
    recipeTitle: 'Mediterranean Quinoa Bowl',
    servings: 2,
  },
  {
    id: '10',
    date: '2024-11-20',
    meal: 'Dinner',
    recipeId: '8',
    recipeTitle: 'Korean Beef Bulgogi',
    servings: 4,
  },

  // Thursday
  {
    id: '11',
    date: '2024-11-21',
    meal: 'Breakfast',
    recipeId: '7',
    recipeTitle: 'Berry Smoothie Bowl',
    servings: 1,
  },
  {
    id: '12',
    date: '2024-11-21',
    meal: 'Lunch',
    recipeId: '6',
    recipeTitle: 'Mushroom Risotto',
    servings: 2,
  },
  {
    id: '13',
    date: '2024-11-21',
    meal: 'Dinner',
    recipeId: '1',
    recipeTitle: 'Creamy Tuscan Chicken',
    servings: 4,
  },

  // Friday
  {
    id: '14',
    date: '2024-11-22',
    meal: 'Breakfast',
    recipeId: '4',
    recipeTitle: 'Smoked Salmon Avocado Toast',
    servings: 1,
  },
  {
    id: '15',
    date: '2024-11-22',
    meal: 'Lunch',
    recipeId: '2',
    recipeTitle: 'Mediterranean Quinoa Bowl',
    servings: 2,
  },
  {
    id: '16',
    date: '2024-11-22',
    meal: 'Dinner',
    recipeId: '5',
    recipeTitle: 'Thai Green Curry',
    servings: 4,
  },

  // Saturday
  {
    id: '17',
    date: '2024-11-23',
    meal: 'Brunch',
    recipeId: '3',
    recipeTitle: 'Classic Chocolate Chip Cookies',
    servings: 6,
  },
  {
    id: '18',
    date: '2024-11-23',
    meal: 'Dinner',
    recipeId: '8',
    recipeTitle: 'Korean Beef Bulgogi',
    servings: 4,
  },

  // Sunday
  {
    id: '19',
    date: '2024-11-24',
    meal: 'Breakfast',
    recipeId: '7',
    recipeTitle: 'Berry Smoothie Bowl',
    servings: 2,
  },
  {
    id: '20',
    date: '2024-11-24',
    meal: 'Lunch',
    recipeId: '6',
    recipeTitle: 'Mushroom Risotto',
    servings: 4,
  },
  {
    id: '21',
    date: '2024-11-24',
    meal: 'Dinner',
    recipeId: '1',
    recipeTitle: 'Creamy Tuscan Chicken',
    servings: 4,
  },
];

export const getMealsForDate = (date: string) => {
  return mockMealPlan.filter(item => item.date === date);
};

export const getMealsForWeek = (startDate: string) => {
  // Simple implementation - in real app would calculate week range
  return mockMealPlan;
};