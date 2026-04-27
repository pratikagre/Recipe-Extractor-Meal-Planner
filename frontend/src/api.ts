import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export interface Recipe {
    id: number;
    url: string;
    title: string;
    cuisine: string;
    prep_time: string;
    cook_time: string;
    total_time: string;
    servings: number;
    difficulty: string;
    ingredients: Array<{ quantity: string; unit: string; item: string }>;
    instructions: string[];
    nutrition_estimate: { calories: number; protein: string; carbs: string; fat: string };
    substitutions: string[];
    shopping_list: Record<string, string[]>;
    related_recipes: string[];
    created_at: string;
}

export const extractRecipe = async (url: string): Promise<Recipe> => {
  const { data } = await api.post('/extract', { url });
  return data;
};

export const getRecipes = async (): Promise<Recipe[]> => {
  const { data } = await api.get('/recipes');
  return data;
};

export const getMealPlan = async (recipeIds: number[]): Promise<any> => {
  const { data } = await api.post('/meal_plan', recipeIds);
  return data;
};
