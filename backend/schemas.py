from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Optional, Any
from datetime import datetime

class RecipeURL(BaseModel):
    url: HttpUrl

class Ingredient(BaseModel):
    quantity: str
    unit: str
    item: str

class Nutrition(BaseModel):
    calories: Optional[int] = None
    protein: Optional[str] = None
    carbs: Optional[str] = None
    fat: Optional[str] = None

class RecipeBase(BaseModel):
    url: str = ""
    title: str = "Unknown"
    cuisine: str = "Unknown"
    prep_time: str = ""
    cook_time: str = ""
    total_time: str = ""
    servings: int = 1
    difficulty: str = "medium"
    ingredients: List[Any] = []
    instructions: List[str] = []
    nutrition_estimate: Dict[str, Any] = {}
    substitutions: List[str] = []
    shopping_list: Dict[str, Any] = {}
    related_recipes: List[str] = []

class RecipeCreate(RecipeBase):
    pass

class RecipeOut(RecipeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
