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
        #password="root",
        password="root",
        database="leads"
    )
    
    query = 'Select DISTINCT localisation.telephone, localisation.email, localisation.treshold, name.Nom, localisation.id from localisation JOIN name on localisation.neq = name.NEQ JOIN ville v on localisation.ville = v.ville_name JOIN mrc on v.mrc_id = mrc.mrc_id where localisation.email is NULL and mrc.mrc_id in (100,101,107,108,111,112) LIMIT 5'
    #query = 'Select DISTINCT localisation.téléphone, localisation.courriel, localisation.treshold, name.Nom, localisation.id from localisation JOIN name on localisation.neq = name.NEQ JOIN ville v on localisation.ville = v.ville_name JOIN mrc on v.mrc_id = mrc.mrc_id where localisation.courriel is NULL and mrc.mrc_id in (100,101,107,108,111,112) LIMIT 1'

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
    #query =f"Update localisation set courriel = '{email}', treshold = {rounded_treshold}, téléphone = {telephone}  where id= {lead_id};"
    print(f"6. Updating database item {lead_id} with : {email} - {rounded_treshold} - {telephone}")
    mycursor = mydb.cursor()
    mycursor.execute(query)
    
    mydb.commit()
    mydb.close()
    return


# MODULE: UTILS ######################################################################################################################################################################################

# Looks for similarity (0 is 0%, 1 is 100%)
def isSimilar(a, b):
    print(f'COMPARING : {a} and {b}')
    result = SequenceMatcher(None, a, b).ratio()
    print(f'RESULT : {result}')
    return result


# Formats the email if it's an array or null
KEYWORDS = ["info", "admin", "sales", "ventes", "contact"]
def found_emails_formatting(found_emails):
    print('5. Found emails: ', found_emails)
    if found_emails:    
        if isinstance(found_emails, list):       
            #Look if one of the email contains the keywords info or admin or sales or contact
            for email in found_emails:
                split_email =  email.split("@")
                if any(substring in split_email[0] for substring in KEYWORDS):
                    return email
                if any(substring in split_email[1] for substring in KEYWORDS):
                    return email
                
            # If no email found with keywords, return the first 3 emails
            return found_emails[:3]
        
        # If it's not a list but a str
        else:
            return found_emails
    else:
        return "INVALID"


# Erases "inc", "enr", " ' " from the company name
def format_name (name):
    name = name.lower().replace("'", '')
    list_name = name.split(" ")
    inc_pattern = re.compile(r'\bInc\.?\b', flags=re.IGNORECASE)
    enr_pattern = re.compile(r'\bEnr\.?\b', flags=re.IGNORECASE)
    for word in list_name[:]:
        if inc_pattern.match(word) or enr_pattern.match(word):
            list_name.remove(word)

    return " ".join(list_name)


# Compares company name and email words to find similarity
def validate_company_name(name, email):
    email_split =  email.split('@')           
    email_username = email_split[0]
    email_username = email_username.lower().replace(' ', '')
    email_domain = email_split[1].split('.')[0]

    # Normalize company name for comparison
    company_name_normalized = name.lower().replace(' ', '')

    # Calculate similarity
    username_similarity = isSimilar(company_name_normalized, email_username)
    if username_similarity < 0.55:
         domain_similarity = isSimilar(company_name_normalized, email_domain)
         return domain_similarity

    return username_similarity


# Returns the average similarity score between the email and the company name individual words
def second_validate (name, email): 
    list_result= []
    list_name = name.split(" ")
    for n in list_name:
        result = validate_company_name(n, email)
        if (result >= 0.8):
            return result
        list_result.append(result)
    average =  sum(list_result) / len(list_result)
    return average


# Uses all the verification tools to find out if found emails match company
def verification_email(emails, company_name):
    # Getting verified emails, might be one, might be many
    verified_emails = found_emails_formatting(emails)
    company_name = format_name(company_name)

    # If only one email is returned
    if isinstance(verified_emails, str):
        if verified_emails == "INVALID":
            treshold = 0
            return verified_emails, treshold

        result = validate_company_name(company_name, verified_emails)

        if result >= 0.55:
            return verified_emails, result
        else: 
            result = second_validate(company_name, verified_emails)
            if result >= 0.45:
                return verified_emails, result
            else: 
                verified_emails = "INVALID"
                treshold = result
                return verified_emails, treshold

    # If many emails are returned
    best_found_treshold = 0
    for email in verified_emails:
        if email == "INVALID":
            continue

        result = validate_company_name(company_name, email)

        if result >= 0.55:
            return email, result
        else: 
            result = second_validate(company_name, email)
            if result >= 0.45:
                return email, result
            else:
                if (result > best_found_treshold):
                    best_found_treshold = result
                continue
    
    return "INVALID", best_found_treshold
    

# MODULE: FACEBOOK SCRAPER ######################################################################################################################################################################################

# get the Facebook info
async def get_facebook_info(company_name):
    async with async_playwright() as p:
        try: 
            browser = await p.chromium.launch(headless=False)  # Set headless=True for headless mode
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
                phone_pattern = re.compile(r"^[0-9]{3}-[0-9]{3}-[0-9]{4}$")
                found_phone = re.findall(phone_pattern, page_content)


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
                    links = await page.query_selector_all('h3')

                    # Looks in the links if links contains Pages Jaunes
                    website_to_skip = ["LinkedIn", "Pages Jaunes", "YellowPages.ca", "Canada 411", "PagesJaunes.ca"]
                    for link in links:
                        if any(keyword in await link.inner_text() for keyword in website_to_skip):
                              continue
                        await link.click()
                        pageUrl = page.url
                        print(pageUrl)
                        await browser.close()
                        return pageUrl
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
    # Each lead is an array of values
    for idx, lead in enumerate(leads):
        print(f"1. Lead #{idx + 1} in process : {lead}")

        # Trying to get email from FB
        # get_facebook_info return { "email" : company_emails, "phone": company_phone }
        facebook_info = await get_facebook_info(lead[3])
        print("2. Facebook infos found : ", facebook_info)

        if facebook_info:
            # Process of verification
            lead_result = verification_email(facebook_info["email"], lead[3])
            
            # Update database
            if lead_result[0] != "INVALID":
                found += 1
                update_database(lead[4], lead_result[0], lead_result[1], facebook_info["phone"] or "NULL")
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
            
        update_database(lead[4], lead_result[0], lead_result[1], "NULL")
        print("-----------------------------------------------------")
    
    print("Total : ", total)
    print("Wins : ", found)
    print("Win % : ", found * 100 / total)
    return "End of the script"


# Run the script
asyncio.run(main())



