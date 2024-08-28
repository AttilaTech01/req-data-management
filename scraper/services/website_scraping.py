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
                founds_infos = {"email": "INVALID", "phone": None} 
                #If no url is provided
                if not website:
                     return founds_infos
               
                try:
                    browser = await p.chromium.launch(headless=False)  # Set headless=True for headless mode
                    page =  await browser.new_page()

                    # Go to website and wait for page to load main page
                    await page.goto(website)
                    page_content = await page.content()

                    # Search regex pattern in my html content
                    pattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
                    found_emails = re.findall(pattern, page_content)
                    phone_pattern = re.compile(r"\(\d{3}\) \d{3}-\d{4}")
                    found_phone = re.findall(phone_pattern, page_content)

                    # Search for contact page if the email not found
                    if not found_emails:
                        contact_button = await page.query_selector("button[name='Contact']")
                        if contact_button and await contact_button.is_visible():
                            await contact_button.click()
                            await page.wait_for_timeout(1000)
                            contact_page_content = await page.content()
                            found_emails = re.findall(pattern, contact_page_content)

                            # If nothing is found in the contact
                            if not found_emails:
                                 await browser.close()
                                 return founds_infos

                    if found_emails:
                        founds_infos["email"] = found_emails
                        founds_infos["phone"] = found_phone[0] if found_phone else None
                        return founds_infos
                except:
                    print("There was an error")

                await browser.close()
                return founds_infos