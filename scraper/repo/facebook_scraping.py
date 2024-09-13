import asyncio
from playwright.async_api import async_playwright
import re




async def get_facebook_info(Scraper):
    async with async_playwright() as p:
        try:  
            # Create a new Facebook browser
            browser = await p.chromium.launch(headless=False)  # Set headless=True for headless mode
            page = await browser.new_page()
            await page.goto(f"https://www.google.com/search?q={Scraper.company_name}")

            # Waiting for google's search list and looks if there is any facebook link
            page_content = await page.content()
            facebook_pattern = re.compile(r"https:\/\/www\.facebook\.com\/[a-zA-Z0-9\.\-\/_]+")
            facebook_links = facebook_pattern.findall(page_content)

            #If facebook links are found
            if facebook_links:
                facebook_link = facebook_links[0]  # Take the first match if multiple found

                # Go to the Facebook page
                await page.goto(facebook_link)
                
                # Wait for the Facebook page to load
                await page.wait_for_selector('body')
                await page.wait_for_timeout(1000)
                
                # Try to click on the x button
                await page.get_by_role("button", name="Close").click()
                
                # Extract Facebook textbox content 
                facebook_textbox = await page.locator(".x9f619.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.x1qughib.x1qjc9v5.xozqiw3.x1q0g3np.x1pi30zi.x1swvt13.xyamay9.xykv574.xbmpl8g.x4cne27.xifccgj").all_inner_texts()

                # Extract the email with the regex
                email_pattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
                phone_pattern = '\d{3}-\d{4}'
                no_regional_pattern= '\(\d{3}\)'
                phone= None
                no_regional = None

                for text in facebook_textbox:
                    mots = text.split()
                    for mot in mots:
                        if re.match(email_pattern, mot):
                            Scraper.email_list.append(mot)
                        
                        #Check to find (418)
                        if re.match(no_regional_pattern, mot):
                            no_regional = mot

                        # Check to find 333-3333
                        if re.match(phone_pattern, mot):
                            phone = mot

                #If the phone number and the no Regional is true join the two strings and append to phone list
                # BUG look if there is many numbers what will happen
                if phone and no_regional:
                    Scraper.phone_list.append(str(no_regional + " " + phone))
            
                # Close and return
                print(f"2. Facebook found infos : {Scraper.email_list}, {Scraper.phone_list}")
                await browser.close()
                return 
            
            # If there is no facebook links, close and return None
            await browser.close()
            return 

        except:
             return 