import asyncio
from playwright.async_api import async_playwright
import re




async def get_facebook_info(company_name):
    async with async_playwright() as p:
        #Initiate Found infos object
        founds_infos = {
            "email" : [],
            "phone":[]
            }
        try: 
            
             # Create a new Facebook browser
            browser = await p.chromium.launch(headless=False)  # Set headless=True for headless mode
            # BUG - ne semble même pas lancer le browser
            context = await browser.new_context(storage_state="facebookcookie.json")
            page = await context.new_page()

            await page.goto(f"https://www.google.com/search?q={company_name}")

            # Waiting for google's search list adn looks if there is any facebook link
              
            page_content = await page.content()

            facebook_pattern = re.compile(r"https:\/\/www\.facebook\.com\/[a-zA-Z0-9\.\-\/_]+")
            facebook_links = facebook_pattern.findall(page_content)
            #If a Facebook links is Found
            if facebook_links:
                facebook_link = facebook_links[0]  # Take the first match if multiple found
                # Go to the Facebook page
                await page.goto(facebook_link)
                
                # Wait for the Facebook page to load
                await page.wait_for_selector('body')
                await page.wait_for_timeout(1000)
                # Extract Facebook textbox content 
                facebook_textbox = await page.locator(".x9f619.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.x1qughib.x1qjc9v5.xozqiw3.x1q0g3np.x1pi30zi.x1swvt13.xyamay9.xykv574.xbmpl8g.x4cne27.xifccgj").all_inner_texts()
                #print("this is fb textbox",facebook_textbox)
            # Extract the email with the regex

                email_pattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
                phone_pattern = '\(\d{3}\) \d{3}-\d{4}'
                #company_emails = re.findall(email_pattern,page_content)
                for text in facebook_textbox:
                    mots = text.split()
                    for mot in mots:
                        #print("This is the Current Word we are parsing", mot)
                        # found emails
                        if re.match(email_pattern, mot):
                            print("------------------------------------------------")
                            print("Ce email a passé les filtres", mot)
                            print("------------------------------------------------")
                            founds_infos["email"].append(mot)
                        if re.match(phone_pattern, mot):
                            founds_infos["phone"].append(mot)
                    print("facebook found infos", founds_infos)
                #Close and return
                await browser.close()
                return founds_infos
            
            # If there is no facebook links, close and return None
            await browser.close()
            return founds_infos

        except:
             return founds_infos