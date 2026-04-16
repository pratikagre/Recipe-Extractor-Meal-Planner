import React from 'react';
import { Recipe } from '../api';

export const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  // Ensure we have default objects if data is malformed
  const nutrition = recipe.nutrition_estimate || {calories: 0, protein: '0g', carbs: '0g', fat: '0g'};
  const shopping_list = recipe.shopping_list || {};

  return (
    <div className="card">
      <div className="recipe-header">
        <h2>{recipe.title}</h2>
        <div className="recipe-stats">
          <span className="badge">{recipe.cuisine}</span>
          <span className="badge">Diff: {recipe.difficulty}</span>
          <span>Prep: {recipe.prep_time}</span>
          <span>Cook: {recipe.cook_time}</span>
          <span>Servings: {recipe.servings}</span>
        </div>
      </div>

      <div className="grid-cols-2">
        <div>
          <h3 className="section-title">Ingredients</h3>
          <ul className="list ingredients-list">
            {recipe.ingredients?.map((ing, i) => (
              <li key={i}>
                <strong>{ing.quantity} {ing.unit}</strong> {ing.item}
              </li>
            ))}
          </ul>
          
          <h3 className="section-title" style={{marginTop: '1.5rem'}}>Shopping List</h3>
          {Object.keys(shopping_list).length > 0 ? Object.entries(shopping_list).map(([category, items]) => (
            <div key={category} style={{marginBottom: '1rem'}}>
              <h4 style={{textTransform: 'capitalize', color: 'var(--text-muted)'}}>{category}</h4>
              <ul className="list">
                {items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )) : <p>No shopping list available</p>}
        </div>

        <div>
          <h3 className="section-title">Instructions</h3>
          <ol className="list">
            {recipe.instructions?.map((step, i) => (
              <li key={i} style={{marginBottom: '1rem'}}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div style={{marginTop: '2rem'}}>
        <h3 className="section-title">Nutrition Estimate (per serving)</h3>
        <div className="nutrition-grid">
          <div className="nutrition-item">
            <div className="nutrition-value">{nutrition.calories}</div>
            <div className="nutrition-label">Calories</div>
          </div>
          <div className="nutrition-item">
            <div className="nutrition-value">{nutrition.protein}</div>
            <div className="nutrition-label">Protein</div>
          </div>
          <div className="nutrition-item">
            <div className="nutrition-value">{nutrition.carbs}</div>
            <div className="nutrition-label">Carbs</div>
          </div>
          <div className="nutrition-item">
            <div className="nutrition-value">{nutrition.fat}</div>
            <div className="nutrition-label">Fat</div>
          </div>
        </div>
      </div>

      <div className="grid-cols-2" style={{marginTop: '2rem'}}>
         <div>
          <h3 className="section-title">Substitutions</h3>
          <ul className="list">
            {recipe.substitutions?.map((sub, i) => <li key={i}>{sub}</li>)}
          </ul>
         </div>
         <div>
          <h3 className="section-title">Related Recipes</h3>
          <ul className="list">
            {recipe.related_recipes?.map((rel, i) => <li key={i}>{rel}</li>)}
          </ul>
         </div>
      </div>
    </div>
  );
};
