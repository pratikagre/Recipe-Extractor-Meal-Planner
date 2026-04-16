import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from schemas import RecipeCreate
from dotenv import load_dotenv

load_dotenv()

def extract_recipe_data(text: str, url: str) -> dict:
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0,
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    
    structured_llm = llm.with_structured_output(RecipeCreate)
    
    prompt_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "prompts", "recipe_extraction.txt")
    if not os.path.exists(prompt_path):
        prompt_path = os.path.join(os.getcwd(), "prompts", "recipe_extraction.txt")

    with open(prompt_path, 'r', encoding='utf-8') as f:
        template = f.read()

    prompt = PromptTemplate.from_template(template)
    formatted_prompt = prompt.format(content=text, url=url)
    
    result = structured_llm.invoke(formatted_prompt)
    result.url = url
    return result

def generate_meal_plan(recipes_json: str):
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.2,
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    
    prompt_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "prompts", "meal_planning.txt")
    if not os.path.exists(prompt_path):
        prompt_path = os.path.join(os.getcwd(), "prompts", "meal_planning.txt")

    with open(prompt_path, 'r', encoding='utf-8') as f:
        template = f.read()

    prompt = PromptTemplate.from_template(template)
    
    from pydantic import BaseModel
    from typing import Dict, List
    class MealPlanOut(BaseModel):
        shopping_list: Dict[str, List[str]]
        
    structured_llm = llm.with_structured_output(MealPlanOut)
    
    formatted_prompt = prompt.format(recipes_json=recipes_json)
    
    result = structured_llm.invoke(formatted_prompt)
    return result.model_dump()
