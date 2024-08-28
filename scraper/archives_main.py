import asyncio
from playwright.async_api import async_playwright
import re
from difflib import SequenceMatcher
import mysql.connector

# MODULE: DATABASE ######################################################################################################################################################################################

# Queries the database to get leads without a email
def get_leads_from_database():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="leads"
    )
    
    query = 'Select DISTINCT l.telephone, l.email, l.treshold, l.company_name, l.id from localisation l JOIN ville v on l.ville = v.ville_name JOIN mrc on v.mrc_id = mrc.mrc_id where l.email is NULL and l.company_name is not NULL and mrc.mrc_id in (100,101,107,108,111,112) LIMIT 5'

    mycursor = mydb.cursor()
    mycursor.execute(query)
    rows= mycursor.fetchall()
    
    return rows


# Updating the database with found values
def update_database(lead_id, email, treshold, telephone):
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        #password="root",
        password="root",
        database="leads"
    )
    rounded_treshold = round(treshold, 2)
    
    query =f"Update localisation set email = '{email}', treshold = {rounded_treshold}, telephone = {telephone}  where id= {lead_id};"
    print("This the Query", query)
    print(f"6. Updating database item {lead_id} with : {email} - {rounded_treshold} - {telephone}")
    mycursor = mydb.cursor()
    mycursor.execute(query)
    
    mydb.commit()
    mydb.close()
    return



    

# MODULE: FACEBOOK SCRAPER ######################################################################################################################################################################################

# get the Facebook info
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
                     "phone": found_phone or None
                }

                #Close and return
                await browser.close()
                return founds_infos
            
            # If there is no facebook links, close and return None
            await browser.close()
            return None

        except:
             return None


# MODULE: GOOGLE SCRAPER ######################################################################################################################################################################################

# Function to get the website url
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
                    
                    print("Website URL")
                    print(list_of_links)
                    # List of website url that we want to skip
                    website_to_skip_regex = [r"https://ca.linkedin.com/", r"https://www.pagesjaunes.ca/", r"https://www.yellowpages.ca/", r"https://www.fr.canada411.ca/"]
                    
                    for link in list_of_links:
                        for regex in website_to_skip_regex:
                            if re.search(regex, link):
                                list_of_links.remove(link)
                    

                    
                    await browser.close()
                    print(list_of_links)
                    return list_of_links[0]
                except:
                     return None


# get the contact email
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
                    phone_pattern = re.compile(r"^[0-9]{3}-[0-9]{3}-[0-9]{4}$")
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

                except:
                    print("There was an error")

                await browser.close()
                return founds_infos
                

'''
# List of companies to search for
# Old version
async def get_website_contact(website):
           async with async_playwright() as p:
                # trr
                browser = await p.chromium.launch(headless=False)  # Set headless=True for headless mode
                page =  await browser.new_page()
                
                urls = []
                await page.goto(website)
                regex_email =  re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
                
                page = await page.content()
                email_home = regex_email.findall(page)
                for li in await page.get_by_text("Contact").all():
                    await li.click()
                    curr_page = await page.content()
                    email = regex_email.findall(curr_page) 
                    
                #if Contact:
                    #Contact = await page.get_by_text("Contact").click()

                await browser.close()
                return email_home, email
'''    


########################################################################################################################################

async def main():
    leads = get_leads_from_database()
    total = len(leads)
    found = 0
    
    # Looping over our database leads result
    # Each lead is an array of values: telephone, email, treshold, company_name, id
    for idx, lead in enumerate(leads):
        print(f"1. Lead #{idx + 1} in process : {lead}")

        # Trying to get email from FB
        # get_facebook_info return { "email" : company_emails, "phone": company_phone }
        facebook_info = await get_facebook_info(lead[3])
        print("2. Facebook infos found : ", facebook_info)

        if facebook_info:
            # Process of verification, returns [verified_emails, treshold]
            lead_result = verification_email(facebook_info["email"], lead[3])
            
            # Update database
            if lead_result[0] != "INVALID":
                found += 1
                # update_database(lead_id, email, treshold, telephone)
                #update_database(lead[4], lead_result[0], lead_result[1], facebook_info["phone"] or "NULL")
                print("-----------------------------------------------------")
                continue
             
        # Trying to get website from Google
        website_url = await get_website_url(lead[3])
        print("3. URL : ",website_url)

        # Trying to get email from the found website
        website_info = await get_website_info(website_url)
        print("4. Web infos : ",website_info)

        # Process of verification
        lead_result = verification_email(website_info["email"], lead[3])
        if lead_result[0] != "INVALID":
            found += 1
            
        #update_database(lead[4], lead_result[0], lead_result[1], "NULL")
        print("-----------------------------------------------------")
    
    print("Total : ", total)
    print("Wins : ", found)
    print("Win % : ", found * 100 / total)
    return "End of the script"


# Run the script

asyncio.run(main())



