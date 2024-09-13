import asyncio
from playwright.async_api import async_playwright
import re
from urllib.parse import urlparse



async def get_website_url(Scraper):
           async with async_playwright() as p:
                try:
                    browser = await p.chromium.launch(headless=False)  # Set headless=True for headless mode
                    page =  await browser.new_page()
                    await page.goto(f"https://www.google.com/search?q={Scraper.company_name}")

                    # Look for Google Profile
                    button = await page.get_by_role("button", name="Site Web").is_visible()
                    
                    if button:
                        await page.get_by_role("button", name="Site Web").click(timeout=2000)
                        pageUrl = page.url
                        return pageUrl

                    # Extraire toutes les URLs des résultats de recherche
                    await page.wait_for_selector('h3')
                    # Return un array des liens de la page
                    list_of_links = await page.locator('.byrV5b').all_inner_texts()
                    
                    # List of website url that we want to skip
                    website_to_skip_regex = [r"https://ca.linkedin.com/", r"https://www.pagesjaunes.ca/", r"https://www.yellowpages.ca/", r"https://www.fr.canada411.ca/"]
                    
                    for link in list_of_links:
                        for regex in website_to_skip_regex:
                            if re.search(regex, link):
                                list_of_links.remove(link)
                    
                    await browser.close()
                    
                    # Format the string to only get the url
                    url = urlparse(list_of_links[0])
                    url = url.hostname.split("›")
                    Scraper.website_url = "https://"+url[0]
                    print(f"3. Chosen URL : {Scraper.website_url}")
                    return
                except:
                     return 
                


async def get_website_info(Scraper):
           async with async_playwright() as p:
                #If no url is provided
                if not Scraper.website_url:
                     return 
               
                try:
                    #Initialisation du browser
                    browser = await p.chromium.launch(headless=False)  # Set headless=True for headless mode
                    page =  await browser.new_page()

                    # Go to website and wait for page to load main page
                    await page.goto(Scraper.website_url)
                   
                    # Extract and parse website text content
                    website_text = await page.locator('div').all_inner_texts()
                    email_pattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
                    phone_pattern = '\(\d{3}\) \d{3}-\d{4}'

                    # Loop dans les mots de la page 
                    for text in website_text:
                        mots = text.split()
                        for mot in mots:
                            if re.match(email_pattern, mot):
                               Scraper.email_list.append(mot) 

                            if re.match(phone_pattern, mot):
                                Scraper.phone_list.append(mot)
                  
                    print(f"4. Website found infos : {Scraper.email_list}, {Scraper.phone_list}")
                    await browser.close()
                    return
                except:
                    print("There was an error")
                    return
