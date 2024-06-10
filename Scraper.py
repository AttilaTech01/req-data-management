import asyncio
from playwright.async_api import async_playwright
from playwright.sync_api import sync_playwright
import re
from difflib import SequenceMatcher
import dns.resolver
import mysql.connector


def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()
            






def format_name (name):
    name = name.lower()
    list_name = name.split(" ")
    pattern = re.compile(r'\bInc\.?\b', flags=re.IGNORECASE)
    for x in enumerate(list_name):
        if pattern.match(x[1]):
            list_name.pop(x[0])

    return " ".join(list_name)



def validate_company_name(name, email):
                
    base_domain = email.split('@')[1]
    base_domain = base_domain.split('.')[0]
    #print(base_domain)
    # Normalize company name and domain for comparison
    company_name_normalized = name.lower().replace(' ', '')
    base_domain_normalized = base_domain.lower().replace(' ', '')
    #print(company_name_normalized)
    #print(base_domain_normalized)
    # Calculate similarity
    similarity = similar(company_name_normalized, base_domain_normalized)
    #print(similarity)
    return similarity
    


def second_valdiate (name, company_email): 
    list_result= []
    list_name = name.split(" ")
    for n in list_name:
        result = validate_company_name(n, company_email)
        list_result.append(result)
    average = sum(list_result) / len(list_result)
    print(average)
    if average >= 0.5:
        print("The email is good")
    else: 
        print("The Email is bad")






# Add the search for contact and for 

async def get_website_contact(website):
           async with async_playwright() as p:
                # trr
                browser = await p.chromium.launch(headless=False)  # Set headless=True for headless mode
                page =  await browser.new_page()
                
                urls = []
                await page.goto(website)
                regex_email =  re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
                
                page = await page.content()
                print(page)
                email_home = regex_email.findall(page)
                print(email_home)
                for li in await page.get_by_text("Contact").all():
                    await li.click()
                    curr_page = await page.content()
                    email = regex_email.findall(curr_page) 
                    
                #if Contact:
                    #Contact = await page.get_by_text("Contact").click()
                await browser.close()


                return email_home, email



async def get_website_url(company_name):
           async with async_playwright() as p:
                browser = await p.chromium.launch(headless=False)  # Set headless=True for headless mode
                page =  await browser.new_page()
                
                urls = []
                await page.goto(f"https://www.google.com/search?q={company_name}")
               # first_result_selector = 'h3 a'  # Selector for the first result link
               # xz = page.locator(first_result_selector)
                

        # Extraire toutes les URLs des résultats de recherche
                #results = await page.get_by_role("Heading").all_inner_texts()  
                element = await page.query_selector('a.sVXRqc')
                await page.wait_for_timeout(5000)
                url = await element.get_attribute('href') if element else None
                await browser.close()
                print(url)
                return url

async def get_contact_info(company_name):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # Set headless=True for headless mode
        context = await browser.new_context()
        page = await context.new_page()

        await page.goto(f"https://www.google.com/search?q={company_name}")

       #wait the page 
        await page.wait_for_selector('div#search')
        page_content = await page.content()

        facebook_pattern = re.compile(r"https:\/\/www\.facebook\.com\/[a-zA-Z0-9\.\-\/_]+")
        facebook_links = facebook_pattern.findall(page_content)
  
        if facebook_links:
            facebook_link = facebook_links[0]  # Take the first match if multiple found
            # Go to the Facebook page
            await page.goto(facebook_link)
            
            # Wait for the Facebook page to load
            await page.wait_for_selector('body')

            try:
                await page.click('div[aria-label="Fermer"]')
                print(f"Closed the popup on the Facebook page for {company_name}")
            except:
                print(f"No 'Fermer' button found for {company_name}")

            # Extract email and phone number from the Facebook page
            page_content = await page.content()

            email_pattern = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")

            # Find all matches of the email pattern in the page content
            try: 
                emails = email_pattern.findall(page_content)
                company_email= None
                for email in emails:
                    print(f"Found email: {email}")
                    company_email = email
                else:
                    print(f"No Facebook link found for {company_name}")
            except:
                email = "INVALID"
                treshold = 0
                return email, treshold


            result = validate_company_name(company_name, company_email)

            if result >= 0.55:

                return email, result
            else: 
                result = second_valdiate(company_name, company_email)
                if result >= 0.55:
            
                    return email
                
                else: 
                    email = "INVALID"
                    treshold = 0
                    return email, treshold



        

def get_database():
    mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="leads"
    )
    # Dataabse query to get information about the leads without a email
    query = 'Select DISTINCT localisation.telephone, localisation.email, localisation.treshold, name.Nom, localisation.id from localisation Inner JOIN name on localisation.neq = name.NEQ and localisation.email is NULL LIMIT 2;'


    mycursor = mydb.cursor()
    mycursor.execute(query)
    rows= mycursor.fetchall()
    
 





    return rows

    
def update_database(arr, obj):
    mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="leads"
    )
        

    #Get the ID###############################################
    query =f"Update localisation set email = '{arr[0]}', treshold = {arr[1]}  where id= {obj[4]};"
    print(query)
    mycursor = mydb.cursor()

    mycursor.execute(query)

    mydb.commit()

    return




    # List of companies to search for



async def main():

        
    #leads =  get_database()
    leads = "Galilée Construction inc"
    url = await get_website_url(leads)
    test = await get_website_contact(url)
    print(test)
    #for x in leads:
       # print(x)
       # info = await get_contact_info(x[3])
       # if info == None:
          #  info = ["INVALID", 0]

       # update_database(info, x)    

# Run the script

asyncio.run(main())



