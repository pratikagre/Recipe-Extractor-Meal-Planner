import { useState, useEffect, FormEvent } from 'react';
import { extractRecipe, getRecipes, getMealPlan, Recipe } from './api';
import { RecipeCard } from './components/RecipeCard';
import { Modal } from './components/Modal';

function App() {
  const [activeTab, setActiveTab] = useState<'extract' | 'history'>('extract');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  
  const [history, setHistory] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Meal planner state
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [mealPlanLoading, setMealPlanLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<any>(null);

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const loadHistory = async () => {
    try {
      const data = await getRecipes();
      setHistory(data);
    } catch (err: any) {
       console.error(err);
    }
  };

  const handleExtract = async (e: FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError('');
    setCurrentRecipe(null);
    
    try {
      const data = await extractRecipe(url);
      setCurrentRecipe(data);
      setUrl('');
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Failed to extract recipe.');
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCreateMealPlan = async () => {
    if (selectedIds.length === 0) return;
    setMealPlanLoading(true);
    setMealPlan(null);
    try {
      const plan = await getMealPlan(selectedIds);
      setMealPlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setMealPlanLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 style={{marginBottom: '2rem', textAlign: 'center', fontSize: '3rem'}}>Recipe Extractor & Meal Planner</h1>
      
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'extract' ? 'active' : ''}`}
          onClick={() => setActiveTab('extract')}
        >
          Extract Recipe
        </div>
        <div 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Saved Recipes
        </div>
      </div>

      {activeTab === 'extract' && (
        <div>
          <form className="input-container" onSubmit={handleExtract}>
            <input 
              type="url" 
              className="input" 
              placeholder="Paste recipe blog URL here (e.g. from allrecipes.com)..." 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? <span className="loader"></span> : 'Extract Recipe'}
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}

          {currentRecipe && (
            <div>
              <h2 style={{marginTop: '2rem', marginBottom: '1.5rem', color: 'white', textAlign: 'center'}}>Extraction Successful</h2>
              <RecipeCard recipe={currentRecipe} />
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h2 className="section-title" style={{margin: 0}}>Saved Recipes</h2>
            {selectedIds.length > 0 && (
              <button 
                className="btn btn-secondary" 
                onClick={handleCreateMealPlan}
                disabled={mealPlanLoading}
              >
                {mealPlanLoading ? <span className="loader"></span> : `Generate Meal Plan (${selectedIds.length})`}
              </button>
            )}
          </div>

          <div style={{overflowX: 'auto'}}>
            <table>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Title</th>
                  <th>Cuisine</th>
                  <th>Difficulty</th>
                  <th>Date Extracted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map(recipe => (
                  <tr key={recipe.id}>
                    <td>
                      <input 
                        type="checkbox" 
                        className="checkbox"
                        checked={selectedIds.includes(recipe.id)}
                        onChange={() => toggleSelect(recipe.id)}
                      />
                    </td>
                    <td style={{fontWeight: 500}}>{recipe.title}</td>
                    <td>{recipe.cuisine}</td>
                    <td>{recipe.difficulty}</td>
                    <td>{new Date(recipe.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-secondary" style={{padding: '0.4rem 0.8rem', fontSize: '0.9rem'}} onClick={() => openDetails(recipe)}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{textAlign: 'center', color: 'var(--text-muted)'}}>No recipes saved yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {mealPlan && (
             <div style={{marginTop: '2rem', padding: '1.5rem', background: '#F3F4F6', borderRadius: '12px'}}>
                <h3 className="section-title">Merged Shopping List</h3>
                <div className="grid-cols-2">
                  {Object.entries((mealPlan.shopping_list || mealPlan)).map(([cat, items]: [string, any]) => (
                    <div key={cat}>
                       <h4 style={{textTransform: 'capitalize'}}>{cat}</h4>
                       <ul className="list">
                         {Array.isArray(items) ? items.map((it, i) => <li key={i}>{it}</li>) : null}
                       </ul>
                    </div>
                  ))}
                </div>
             </div>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedRecipe && <RecipeCard recipe={selectedRecipe} />}
      </Modal>
    </div>
  );
}

export default App;
