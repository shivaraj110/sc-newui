export interface ShoppingItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  isChecked: boolean;
  category: string;
}

export const mockShoppingList: ShoppingItem[] = [
  // Produce
  { id: '1', name: 'Organic Bananas', amount: 6, unit: 'pieces', isChecked: false, category: 'Fruits' },
  { id: '2', name: 'Strawberries', amount: 1, unit: 'pint', isChecked: false, category: 'Fruits' },
  { id: '3', name: 'Avocados', amount: 4, unit: 'pieces', isChecked: false, category: 'Fruits' },
  { id: '4', name: 'Cherry Tomatoes', amount: 1, unit: 'pint', isChecked: false, category: 'Vegetables' },
  { id: '5', name: 'Baby Spinach', amount: 1, unit: 'bag', isChecked: false, category: 'Vegetables' },
  { id: '6', name: 'Broccoli Crowns', amount: 2, unit: 'pieces', isChecked: false, category: 'Vegetables' },
  { id: '7', name: 'Red Onion', amount: 2, unit: 'pieces', isChecked: false, category: 'Vegetables' },
  { id: '8', name: 'Fresh Garlic', amount: 1, unit: 'bulb', isChecked: false, category: 'Vegetables' },
  { id: '9', name: 'Lemons', amount: 3, unit: 'pieces', isChecked: false, category: 'Fruits' },

  // Dairy
  { id: '10', name: 'Whole Milk', amount: 1, unit: 'gallon', isChecked: true, category: 'Dairy' },
  { id: '11', name: 'Greek Yogurt', amount: 32, unit: 'oz', isChecked: false, category: 'Dairy' },
  { id: '12', name: 'Cheddar Cheese', amount: 8, unit: 'oz', isChecked: false, category: 'Dairy' },
  { id: '13', name: 'Parmesan Cheese', amount: 4, unit: 'oz', isChecked: false, category: 'Dairy' },

  // Meat & Seafood
  { id: '14', name: 'Chicken Breasts', amount: 1.5, unit: 'lbs', isChecked: false, category: 'Meat' },
  { id: '15', name: 'Ground Beef', amount: 1, unit: 'lb', isChecked: false, category: 'Meat' },
  { id: '16', name: 'Smoked Salmon', amount: 8, unit: 'oz', isChecked: false, category: 'Seafood' },

  // Bakery
  { id: '17', name: 'Artisanal Bread', amount: 1, unit: 'loaf', isChecked: true, category: 'Bakery' },
  { id: '18', name: 'Chocolate Chip Cookies', amount: 12, unit: 'pieces', isChecked: false, category: 'Bakery' },

  // Pantry Staples
  { id: '19', name: 'Extra Virgin Olive Oil', amount: 16, unit: 'oz', isChecked: false, category: 'Pantry' },
  { id: '20', name: 'Balsamic Vinegar', amount: 8, unit: 'oz', isChecked: false, category: 'Pantry' },
  { id: '21', name: 'Soy Sauce', amount: 10, unit: 'oz', isChecked: false, category: 'Pantry' },
  { id: '22', name: 'Quinoa', amount: 16, unit: 'oz', isChecked: false, category: 'Pantry' },
  { id: '23', name: 'Arborio Rice', amount: 16, unit: 'oz', isChecked: false, category: 'Pantry' },
  { id: '24', name: 'Pasta', amount: 16, unit: 'oz', isChecked: true, category: 'Pantry' },
  { id: '25', name: 'Canned Tomatoes', amount: 28, unit: 'oz', isChecked: false, category: 'Pantry' },

  // Spices & Seasonings
  { id: '26', name: 'Black Pepper', amount: 2, unit: 'oz', isChecked: false, category: 'Spices' },
  { id: '27', name: 'Italian Seasoning', amount: 2, unit: 'oz', isChecked: false, category: 'Spices' },
  { id: '28', name: 'Ground Cinnamon', amount: 2, unit: 'oz', isChecked: false, category: 'Spices' },

  // Frozen
  { id: '29', name: 'Frozen Mixed Berries', amount: 12, unit: 'oz', isChecked: false, category: 'Frozen' },
  { id: '30', name: 'Vanilla Ice Cream', amount: 1, unit: 'pint', isChecked: false, category: 'Frozen' },

  // Beverages
  { id: '31', name: 'Almond Milk', amount: 32, unit: 'oz', isChecked: false, category: 'Beverages' },
  { id: '32', name: 'Orange Juice', amount: 64, unit: 'oz', isChecked: false, category: 'Beverages' },
];

export const shoppingCategories = [
  'Fruits',
  'Vegetables',
  'Dairy',
  'Meat',
  'Seafood',
  'Bakery',
  'Pantry',
  'Spices',
  'Frozen',
  'Beverages',
  'Snacks',
  'Condiments',
];