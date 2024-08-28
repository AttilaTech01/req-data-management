import asyncio
from playwright.async_api import async_playwright
import re


async def get_facebook_info(company_name):
    async with async_playwright() as p:
        try: 
            browser = await p.chromium.launch(headless=False)  # Set headless=True for headless mode
            # BUG - ne semble même pas lancer le browser
            context = await browser.new_context(storage_state="facebookcookie.json")
            page = await context.new_page()

            await page.goto(f"https://www.google.com/search?q={company_name}")

            # Waiting for google's search list
                #await page.locator('div#search').wait_for()
            page_content = await page.content()

            facebook_pattern = re.compile(r"https:\/\/www\.facebook\.com\/[a-zA-Z0-9\.\-\/_]+")
            facebook_links = facebook_pattern.findall(page_content)
    
            if facebook_links:
                facebook_link = facebook_links[0]  # Take the first match if multiple found
                # Go to the Facebook page
                await page.goto(facebook_link)
                
                # Wait for the Facebook page to load
                await page.wait_for_selector('body')

                # Extract email 
                page_content = await page.content()
                list_of_text = await page.locator(".x9f619.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.x1qughib.x1qjc9v5.xozqiw3.x1q0g3np.x1pi30zi.x1swvt13.xyamay9.xykv574.xbmpl8g.x4cne27.xifccgj").all_inner_texts()

                print("--------------------------------------------------------------------------------")
                print("This is list of text", list_of_text)
                print("--------------------------------------------------------------------------------")
                email_pattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'

                company_emails = re.findall(email_pattern,page_content)
                if len(company_emails) < 1:
                     return None

                # Extract Phone
                phone_pattern = re.compile(r"\(\d{3}\) \d{3}-\d{4}")
                found_phone = re.findall(phone_pattern, page_content)

                # Format to get the first phone number if it's a list
                if isinstance(found_phone, list):
                    found_phone = found_phone[0]


                
                founds_infos = {
                     "email" : company_emails,
                     "phone": found_phone or "NULL"
                }

                #Close and return
                await browser.close()
                return founds_infos
            
            # If there is no facebook links, close and return None
            await browser.close()
            return None

        except:
             return None