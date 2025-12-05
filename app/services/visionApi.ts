import * as FileSystem from "expo-file-system/legacy";
import Constants from "expo-constants";

const VISION_API_KEY =
  Constants.expoConfig?.extra?.googleCloudVisionApiKey ||
  process.env.EXPO_PUBLIC_GOOGLE_CLOUD_VISION_API_KEY;
const VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate";

export interface DetectedIngredient {
  name: string;
  confidence: number;
}

export interface VisionApiResult {
  ingredients: DetectedIngredient[];
  labels: string[];
  text: string;
}

const KITCHEN_INGREDIENTS = [
  "tomato", "cherry tomato", "roma tomato", "grape tomato", "potato", "sweet potato", "yam",
  "onion", "red onion", "white onion", "yellow onion", "green onion", "spring onion", "scallion",
  "carrot", "baby carrot", "garlic", "garlic clove", "ginger", "ginger root",
  "chili", "chili pepper", "jalapeño", "habanero", "serrano pepper", "poblano", "cayenne",
  "bell pepper", "red pepper", "green pepper", "yellow pepper", "orange pepper",
  "broccoli", "spinach", "kale", "lettuce", "romaine", "iceberg lettuce", "cabbage", "napa cabbage",
  "cauliflower", "cucumber", "english cucumber", "eggplant", "aubergine",
  "zucchini", "courgette", "squash", "butternut squash", "acorn squash", "pumpkin",
  "mushroom", "button mushroom", "shiitake", "portobello", "oyster mushroom", "cremini",
  "corn", "sweet corn", "corn on the cob", "peas", "green peas", "snow peas", "snap peas",
  "beans", "green beans", "kidney beans", "black beans", "pinto beans", "chickpeas", "lentils",
  "celery", "leek", "asparagus", "artichoke", "beet", "beetroot", "radish", "turnip",
  "parsnip", "rutabaga", "bok choy", "brussels sprouts", "fennel", "okra", "bamboo shoots",
  "water chestnut", "bean sprouts", "alfalfa sprouts",
  
  "rice", "white rice", "brown rice", "basmati rice", "jasmine rice", "wild rice", "arborio rice",
  "pasta", "spaghetti", "penne", "macaroni", "fettuccine", "linguine", "rigatoni", "fusilli",
  "bread", "white bread", "wheat bread", "sourdough", "rye bread", "baguette", "ciabatta",
  "tortilla", "pita bread", "naan", "flatbread",
  "flour", "all-purpose flour", "wheat flour", "bread flour", "cake flour", "almond flour",
  "cornstarch", "cornmeal", "oats", "oatmeal", "quinoa", "couscous", "bulgur", "barley",
  "noodles", "ramen", "udon", "soba", "rice noodles", "egg noodles",
  
  "sugar", "white sugar", "brown sugar", "powdered sugar", "cane sugar", "coconut sugar",
  "honey", "maple syrup", "agave", "molasses",
  "salt", "sea salt", "kosher salt", "himalayan salt", "table salt",
  "black pepper", "white pepper", "peppercorn",
  
  "oil", "olive oil", "vegetable oil", "canola oil", "coconut oil", "sesame oil",
  "avocado oil", "peanut oil", "sunflower oil", "grapeseed oil",
  "butter", "unsalted butter", "salted butter", "ghee", "margarine",
  "milk", "whole milk", "skim milk", "almond milk", "soy milk", "coconut milk", "oat milk",
  "cream", "heavy cream", "whipping cream", "sour cream", "half and half",
  "yogurt", "greek yogurt", "plain yogurt",
  "cheese", "cheddar", "mozzarella", "parmesan", "feta", "goat cheese", "cream cheese",
  "swiss cheese", "provolone", "blue cheese", "brie", "ricotta", "cottage cheese",
  "egg", "eggs", "egg white", "egg yolk",
  
  "chicken", "chicken breast", "chicken thigh", "chicken wings", "chicken drumstick",
  "turkey", "duck", "beef", "ground beef", "steak", "ribeye", "sirloin", "brisket",
  "pork", "pork chop", "bacon", "ham", "sausage", "pepperoni", "salami", "prosciutto",
  "lamb", "lamb chop", "veal",
  "fish", "salmon", "tuna", "cod", "tilapia", "halibut", "trout", "mackerel", "sardines",
  "shrimp", "prawns", "crab", "lobster", "scallops", "mussels", "clams", "oysters", "squid",
  "tofu", "tempeh", "seitan",
  
  "apple", "green apple", "red apple", "granny smith", "fuji apple", "gala apple",
  "banana", "plantain", "orange", "mandarin", "tangerine", "clementine",
  "lemon", "lime", "grapefruit", "pomelo",
  "strawberry", "blueberry", "raspberry", "blackberry", "cranberry",
  "grape", "red grape", "green grape", "raisin",
  "watermelon", "cantaloupe", "honeydew", "melon",
  "mango", "papaya", "pineapple", "coconut",
  "peach", "nectarine", "plum", "apricot", "cherry",
  "pear", "fig", "date", "persimmon", "kiwi", "passion fruit", "dragon fruit",
  "avocado", "guava", "lychee", "pomegranate", "star fruit",
  
  "basil", "oregano", "thyme", "rosemary", "sage", "parsley", "cilantro", "coriander",
  "mint", "dill", "tarragon", "chives", "bay leaf",
  "cumin", "coriander seed", "cardamom", "cinnamon", "nutmeg", "cloves", "allspice",
  "paprika", "turmeric", "curry powder", "garam masala", "chili powder",
  "mustard", "mustard seed", "vanilla", "vanilla extract", "almond extract",
  "soy sauce", "fish sauce", "oyster sauce", "worcestershire sauce", "hot sauce",
  "vinegar", "balsamic vinegar", "apple cider vinegar", "rice vinegar", "white vinegar",
  "ketchup", "mayonnaise", "mustard sauce",
  
  "almond", "walnut", "cashew", "peanut", "pecan", "pistachio", "hazelnut", "macadamia",
  "peanut butter", "almond butter", "tahini",
  "sunflower seeds", "pumpkin seeds", "chia seeds", "flax seeds", "sesame seeds",
  
  "tomato sauce", "tomato paste", "tomato puree", "marinara sauce", "salsa",
  "broth", "chicken broth", "beef broth", "vegetable broth", "stock",
  "wine", "red wine", "white wine", "cooking wine", "beer",
  "chocolate", "dark chocolate", "milk chocolate", "cocoa powder", "chocolate chips",
  "baking powder", "baking soda", "yeast", "gelatin", "cornflour",
  
  "water", "juice", "coffee", "tea", "green tea", "black tea",
  "pickle", "pickles", "olives", "capers",
  "jam", "jelly", "marmalade", "peanut butter and jelly",
  "cereal", "granola", "muesli",
  "crackers", "chips", "pretzels", "popcorn",
  "cookies", "biscuits", "cake", "muffins", "brownies",
  "ice cream", "sorbet", "frozen yogurt",
  "canned tomatoes", "canned beans", "canned tuna", "canned corn",
];

const GENERIC_LABELS = [
  "food", "produce", "ingredient", "natural foods", "vegetable", "fruit",
  "food group", "whole food", "vegan food", "superfood", "plant",
  "leaf vegetable", "local food", "staple food", "cuisine", "dish",
  "recipe", "cooking", "kitchen", "grocery", "market", "organic",
  "fresh", "healthy", "nutrition", "diet", "meal", "snack",
  "whole foods", "freshness", "meal", "flowering plant", "terrestrial plant",
];

export async function analyzeImage(imageUri: string): Promise<VisionApiResult> {
  try {
    if (!VISION_API_KEY || VISION_API_KEY === "your_api_key_here") {
      throw new Error(
        "Google Cloud Vision API key is not configured. Please set EXPO_PUBLIC_GOOGLE_CLOUD_VISION_API_KEY in your .env file.",
      );
    }

    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            { type: "LABEL_DETECTION", maxResults: 20 },
            { type: "TEXT_DETECTION", maxResults: 10 },
            { type: "OBJECT_LOCALIZATION", maxResults: 10 },
          ],
        },
      ],
    };

    const response = await fetch(`${VISION_API_URL}?key=${VISION_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Vision API request failed");
    }

    const data = await response.json();

    if (!data.responses || !data.responses[0]) {
      throw new Error("Invalid response from Vision API");
    }

    const result = data.responses[0];

    console.log('=== VISION API RESPONSE ===');
    console.log('Label Annotations:', JSON.stringify(result.labelAnnotations?.slice(0, 15), null, 2));
    console.log('Object Annotations:', JSON.stringify(result.localizedObjectAnnotations, null, 2));
    console.log('Text Annotations:', result.textAnnotations?.[0]?.description);
    console.log('=== END RESPONSE ===');

    return parseVisionApiResponse(result);
  } catch (error) {
    console.error("Vision API Error:", error);
    throw error;
  }
}

function parseVisionApiResponse(response: any): VisionApiResult {
  const labels: string[] = [];
  const detectedText: string[] = [];

  if (response.labelAnnotations) {
    response.labelAnnotations.forEach((label: any) => {
      labels.push(label.description.toLowerCase());
    });
  }

  if (response.textAnnotations && response.textAnnotations.length > 0) {
    const fullText = response.textAnnotations[0].description || "";
    detectedText.push(fullText.toLowerCase());
  }

  const ingredients: DetectedIngredient[] = [];
  const seenIngredients = new Set<string>();

  if (response.labelAnnotations) {
    response.labelAnnotations.forEach((label: any) => {
      const labelName = label.description.toLowerCase().trim();
      const confidence = Math.round(label.score * 100);
      
      if (GENERIC_LABELS.includes(labelName)) {
        return;
      }
      
      const matchedIngredient = KITCHEN_INGREDIENTS.find((ingredient) => {
        const ingredientLower = ingredient.toLowerCase();
        const labelWords = labelName.split(/[\s-]+/);
        const ingredientWords = ingredientLower.split(/[\s-]+/);
        
        if (ingredientLower === labelName) return true;
        
        if (ingredientWords.length === 1 && labelWords.length === 1) {
          if (ingredientLower.includes(labelName) || labelName.includes(ingredientLower)) {
            return Math.abs(ingredientLower.length - labelName.length) <= 3;
          }
        }
        
        if (ingredientWords.every((word: string) => labelWords.includes(word))) return true;
        if (labelWords.every((word: string) => ingredientWords.includes(word))) return true;
        
        return false;
      });
      
      if (matchedIngredient && !seenIngredients.has(matchedIngredient)) {
        ingredients.push({
          name: capitalizeWords(matchedIngredient),
          confidence: Math.min(confidence, 99),
        });
        seenIngredients.add(matchedIngredient);
      }
    });
  }
  
  if (response.localizedObjectAnnotations) {
    response.localizedObjectAnnotations.forEach((obj: any) => {
      const objName = obj.name.toLowerCase().trim();
      const confidence = Math.round(obj.score * 100);
      
      if (GENERIC_LABELS.includes(objName)) {
        return;
      }
      
      const matchedIngredient = KITCHEN_INGREDIENTS.find((ingredient) => {
        const ingredientLower = ingredient.toLowerCase();
        return ingredientLower === objName || 
               ingredientLower.includes(objName) || 
               objName.includes(ingredientLower);
      });
      
      if (matchedIngredient && !seenIngredients.has(matchedIngredient)) {
        ingredients.push({
          name: capitalizeWords(matchedIngredient),
          confidence: Math.min(confidence, 95),
        });
        seenIngredients.add(matchedIngredient);
      }
    });
  }

  ingredients.sort((a, b) => b.confidence - a.confidence);

  return {
    ingredients: ingredients.slice(0, 15),
    labels: labels.slice(0, 10),
    text: detectedText.join(" "),
  };
}

function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export async function captureAndAnalyze(
  cameraRef: any,
): Promise<VisionApiResult> {
  try {
    if (!cameraRef) {
      throw new Error("Camera reference is not available");
    }

    const photo = await cameraRef.takePictureAsync({
      quality: 0.8,
      base64: false,
    });

    if (!photo || !photo.uri) {
      throw new Error("Failed to capture photo");
    }

    return await analyzeImage(photo.uri);
  } catch (error) {
    console.error("Capture and analyze error:", error);
    throw error;
  }
}
