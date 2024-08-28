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
            await page.locator('div#search').wait_for()
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

                email_pattern = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")

                company_emails = email_pattern.findall(page_content)
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