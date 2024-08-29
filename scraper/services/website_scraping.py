import asyncio
from playwright.async_api import async_playwright
import re
from urllib.parse import urlparse



async def get_website_url(company_name):
           async with async_playwright() as p:
                try:
                    browser = await p.chromium.launch(headless=False)  # Set headless=True for headless mode
                    page =  await browser.new_page()
                    await page.goto(f"https://www.google.com/search?q={company_name}")

                  #Looks for Google Profile
                    button = await page.get_by_role("button", name="Site Web").is_visible()
                    if button:
                        await page.get_by_role("button", name="Site Web").click(timeout=2000)
                        pageUrl = page.url
                        return pageUrl

                    # Extraire toutes les URLs des résultats de recherche
                    
                    await page.wait_for_selector('h3')
                    
                    #Return un array des liens de la page
                    list_of_links = await page.locator('.byrV5b').all_inner_texts()
                    
                    #print("Website URL")
                    #print(list_of_links)
                    # List of website url that we want to skip
                    website_to_skip_regex = [r"https://ca.linkedin.com/", r"https://www.pagesjaunes.ca/", r"https://www.yellowpages.ca/", r"https://www.fr.canada411.ca/"]
                    
                    for link in list_of_links:
                        for regex in website_to_skip_regex:
                            if re.search(regex, link):
                                list_of_links.remove(link)
                    

                    
                    await browser.close()
                    #print(list_of_links)
                    
                    # Format the string to only gets the url
                    url = urlparse(list_of_links[0])
                    
                    url = url.hostname.split("›")

                    return "https://"+url[0]
                except:
                     return None
                


async def get_website_info(website):
           async with async_playwright() as p:
                founds_infos = {"email": [], "phone":[]} 
                #If no url is provided
                if not website:
                     return founds_infos
               
                try:
                    browser = await p.chromium.launch(headless=False)  # Set headless=True for headless mode
                    page =  await browser.new_page()

                    # Go to website and wait for page to load main page
                    await page.goto(website)
                   
                    website_text = await page.locator('div').all_inner_texts()
                    print(website_text)
                    email_pattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
                    phone_pattern = '\(\d{3}\) \d{3}-\d{4}'
                    for text in website_text:
                        found_emails = re.findall(email_pattern, text)
                        found_phone = re.findall(phone_pattern, text)
                        founds_infos["emails"].extend(found_emails)
                        founds_infos["phone"].extend(found_phone)

                  
                    await browser.close()
                    return founds_infos
                except:
                    print("There was an error")
                    await browser.close()
                    return founds_infos
