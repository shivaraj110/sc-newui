export interface InventoryItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
  expirationDate?: string;
  dateAdded: string;
  notes?: string;
}

export const mockInventory: InventoryItem[] = [
  // Produce
  { 
    id: '1', 
    name: 'Bananas', 
    amount: 6, 
    unit: 'pieces', 
    category: 'Fruits',
    expirationDate: '2024-12-05',
    dateAdded: '2024-11-15',
    notes: 'Ripe, good for smoothies'
  },
  { 
    id: '2', 
    name: 'Strawberries', 
    amount: 1, 
    unit: 'pint', 
    category: 'Fruits',
    expirationDate: '2024-11-25',
    dateAdded: '2024-11-17'
  },
  { 
    id: '3', 
    name: 'Baby Spinach', 
    amount: 1, 
    unit: 'bag', 
    category: 'Vegetables',
    expirationDate: '2024-11-22',
    dateAdded: '2024-11-16'
  },
  { 
    id: '4', 
    name: 'Cherry Tomatoes', 
    amount: 0.5, 
    unit: 'pint', 
    category: 'Vegetables',
    expirationDate: '2024-11-23',
    dateAdded: '2024-11-14'
  },

  // Dairy
  { 
    id: '5', 
    name: 'Whole Milk', 
    amount: 0.5, 
    unit: 'gallon', 
    category: 'Dairy',
    expirationDate: '2024-11-28',
    dateAdded: '2024-11-10'
  },
  { 
    id: '6', 
    name: 'Greek Yogurt', 
    amount: 16, 
    unit: 'oz', 
    category: 'Dairy',
    expirationDate: '2024-12-01',
    dateAdded: '2024-11-12'
  },
  { 
    id: '7', 
    name: 'Cheddar Cheese', 
    amount: 4, 
    unit: 'oz', 
    category: 'Dairy',
    expirationDate: '2024-12-15',
    dateAdded: '2024-11-08'
  },

  // Meat & Seafood
  { 
    id: '8', 
    name: 'Chicken Breasts', 
    amount: 1, 
    unit: 'lb', 
    category: 'Meat',
    expirationDate: '2024-11-20',
    dateAdded: '2024-11-17',
    notes: 'Use soon!'
  },
  { 
    id: '9', 
    name: 'Ground Beef', 
    amount: 0.5, 
    unit: 'lb', 
    category: 'Meat',
    expirationDate: '2024-11-19',
    dateAdded: '2024-11-15'
  },

  // Pantry Staples
  { 
    id: '10', 
    name: 'Extra Virgin Olive Oil', 
    amount: 12, 
    unit: 'oz', 
    category: 'Pantry',
    dateAdded: '2024-10-15'
  },
  { 
    id: '11', 
    name: 'Quinoa', 
    amount: 8, 
    unit: 'oz', 
    category: 'Pantry',
    dateAdded: '2024-09-20'
  },
  { 
    id: '12', 
    name: 'Pasta', 
    amount: 12, 
    unit: 'oz', 
    category: 'Pantry',
    dateAdded: '2024-10-02'
  },
  { 
    id: '13', 
    name: 'Canned Tomatoes', 
    amount: 28, 
    unit: 'oz', 
    category: 'Pantry',
    dateAdded: '2024-09-30'
  },

  // Spices & Seasonings
  { 
    id: '14', 
    name: 'Black Pepper', 
    amount: 1.5, 
    unit: 'oz', 
    category: 'Spices',
    dateAdded: '2024-08-15'
  },
  { 
    id: '15', 
    name: 'Italian Seasoning', 
    amount: 1.8, 
    unit: 'oz', 
    category: 'Spices',
    dateAdded: '2024-07-20'
  },

  // Frozen
  { 
    id: '16', 
    name: 'Frozen Mixed Berries', 
    amount: 10, 
    unit: 'oz', 
    category: 'Frozen',
    dateAdded: '2024-11-05'
  },
  { 
    id: '17', 
    name: 'Vanilla Ice Cream', 
    amount: 0.5, 
    unit: 'pint', 
    category: 'Frozen',
    dateAdded: '2024-11-10',
    notes: 'Almost finished'
  }
];

export const inventoryCategories = [
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

export const commonUnits = [
  'pieces',
  'oz',
  'lbs',
  'cups',
  'pint',
  'quart',
  'gallon',
  'bag',
  'box',
  'can',
  'bottle',
  'jar',
  'package',
  'bunch'
];