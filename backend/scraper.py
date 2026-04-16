import urllib.request
import requests
from bs4 import BeautifulSoup

def scrape_recipe_page(url: str) -> str:
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Upgrade-Insecure-Requests": "1"
    }
    
    html = ""
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
    except Exception as e1:
        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            html = response.text
        except Exception as e2:
            raise ValueError("Recipe website blocked the extraction (Cloudflare Anti-Bot). Please try friendly websites like:\n• https://tasty.co/recipe/homemade-cinnamon-rolls\n• https://www.bbcgoodfood.com/recipes/classic-victoria-sandwich-recipe")
            
    soup = BeautifulSoup(html, 'html.parser')
    
    for element in soup(["script", "style", "nav", "footer", "header", "noscript"]):
        element.decompose()
        
    text = soup.get_text(separator='\n')
    
    lines = (line.strip() for line in text.splitlines())
    text = '\n'.join(line for line in lines if line)
    
    return text[:25000]
