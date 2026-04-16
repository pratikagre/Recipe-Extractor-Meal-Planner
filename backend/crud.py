from sqlalchemy.orm import Session
import models, schemas

def get_recipe_by_url(db: Session, url: str):
    return db.query(models.Recipe).filter(models.Recipe.url == url).first()

def get_recipes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Recipe).order_by(models.Recipe.created_at.desc()).offset(skip).limit(limit).all()

def create_recipe(db: Session, recipe: schemas.RecipeCreate):
    db_recipe = models.Recipe(**recipe.model_dump())
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe
