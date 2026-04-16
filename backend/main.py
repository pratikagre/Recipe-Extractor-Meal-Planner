from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json

import models, schemas, crud, database, scraper, llm

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Recipe Extractor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/extract", response_model=schemas.RecipeOut)
def extract_recipe(recipe_url: schemas.RecipeURL, db: Session = Depends(database.get_db)):
    db_recipe = crud.get_recipe_by_url(db, str(recipe_url.url))
    if db_recipe:
        return db_recipe
        
    try:
        content = scraper.scrape_recipe_page(str(recipe_url.url))
        recipe_data = llm.extract_recipe_data(content, str(recipe_url.url))
        created_recipe = crud.create_recipe(db, recipe_data)
        
        return created_recipe
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(error_trace)
        raise HTTPException(status_code=500, detail=str(error_trace))

@app.get("/api/recipes", response_model=List[schemas.RecipeOut])
def get_recipes(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return crud.get_recipes(db, skip=skip, limit=limit)

@app.post("/api/meal_plan")
def get_meal_plan(recipe_ids: List[int], db: Session = Depends(database.get_db)):
    recipes = []
    for rid in recipe_ids:
        db_recipe = db.query(models.Recipe).filter(models.Recipe.id == rid).first()
        if db_recipe:
            recipes.append({
                "title": db_recipe.title,
                "ingredients": db_recipe.ingredients
            })
    
    if not recipes:
        raise HTTPException(status_code=404, detail="No valid recipes found")
        
    try:
        meal_plan = llm.generate_meal_plan(json.dumps(recipes))
        return meal_plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
