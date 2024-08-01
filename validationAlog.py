import asyncio
from playwright.async_api import async_playwright
import re
from difflib import SequenceMatcher
import mysql.connector

#div.liYKde g VjDLd
async def get_website_url(company_name):
           async with async_playwright() as p:
                try:
                    browser = await p.chromium.launch(headless=False)  # Set headless=True for headless mode
                    page =  await browser.new_page()
                    await page.goto(f"https://www.google.com/search?q={company_name}")

                    # Extraire toutes les URLs des résultats de recherche
                    # Wait for the page to load
                    button = await page.get_by_role("button", name="Site Web").is_visible()
                    if button:
                        await page.get_by_role("button", name="Site Web").click()
                    
                        await page.wait_for_timeout(5000)
                        pageUrl = page.url
                        return pageUrl
                    
                except:
                     return None



website= "Galilée Construction"          
asyncio.run(get_website_url(website))