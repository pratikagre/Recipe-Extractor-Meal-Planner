# Recipe Extractor & Meal Planner

A full-stack application that accepts a recipe blog URL, extracts structured recipe data using LLMs (Gemini), and provides a meal planning feature. 

## Features
- **Recipe Extraction**: Paste any recipe URL and structural data (ingredients, steps, nutrition, substitutions) is extracted using an LLM.
- **Beautiful UI**: Modern, clean design built with React.
- **Saved History**: All extractions are saved in the database for later viewing.
- **Meal Planner**: Select multiple recipes and generate an aggregated shopping list automatically!

## Tech Stack
- Frontend: React + Vite + Typescript (Vanilla CSS styling as requested)
- Backend: Python FastAPI + SQLAlchemy + LangChain + BeautifulSoup4
- Database: SQLite by default (can be updated to PostgreSQL via `.env`)

## Backend Setup
1. Create virtual environment:
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
```
2. Install dependencies:
```bash
pip install -r requirements.txt
```
3. Set your `.env`:
`GEMINI_API_KEY=YOUR_API_KEY`
4. Run server:
```bash
uvicorn main:app --reload
```
The server will run at `http://localhost:8000/`.

## Frontend Setup
1. Install node modules (make sure node is installed):
```bash
cd frontend
npm install
```
2. Start Dev server:
```bash
npm run dev
```

## API Endpoints
- `POST /api/extract { url: string }` -> Extracts and saves recipe.
- `GET /api/recipes` -> Fetches saved recipes history.
- `POST /api/meal_plan [recipe_ids]` -> Generates meal plans and combined shopping list.

## Testing Instructions
1. Get a GEMINI API KEY from Google AI Studio.
2. Put it in `backend/.env`.
3. Start both backend and frontend servers.
4. Input a URL such as `https://www.allrecipes.com/recipe/23891/grilled-cheese-sandwich/`
5. Enjoy the structured results!

## Prompts Used
The specific LangChain prompts are located in the `prompts/` directory at the project root.
