import asyncio
from playwright.async_api import async_playwright
import re
from difflib import SequenceMatcher
import mysql.connector
from pydantic import BaseModel
from typing import Tuple


# Importing my modules
from services.facebook_scraping import get_facebook_info
from services.website_scraping import get_website_url, get_website_info
from utils.leads_verif import verification_email, format_name
from repo.database_repo import get_leads_from_database, update_database

from services.leads_class import Leads



async def main():
    leads = get_leads_from_database()
    total = len(leads)
    found = 0
    
    # Looping over our database leads result
    # Each lead is an array of values: telephone, email, treshold, company_name, id
    for idx, lead in enumerate(leads):
        print(f"1. Lead #{idx + 1} in process : {lead}")
        #Creating the Objects
        new_leads = Leads(lead[3],lead[4])
        #Formating The Name
        new_leads.format_name()

        # Trying to get email from FB
        # get_facebook_info return { "email" : company_emails, "phone": company_phone }
        facebook_info = await get_facebook_info(new_leads.company_name)
        print("2. Facebook infos found : ", facebook_info)
             
        # Trying to get website from Google
        website_url = await get_website_url(new_leads.company_name)
        print("3. URL : ",website_url)

        # Trying to get email from the found website
        website_info = await get_website_info(website_url)
        print("4. Web infos : ",website_info)
        print(facebook_info)
        scraped_emails = [*facebook_info["email"], *website_info["email"]]
        scraped_phone = [*facebook_info["phone"], *website_info["phone"]]
        # verified wich emails to take
        new_leads.email_verification(scraped_emails)
        #Verif Phone Numbers
        new_leads.phone_verification(scraped_phone)
        #Verif if any email is found if no changes email object value to "NULL"
        new_leads.leads_validation()
        # Update the Database
        update_database(new_leads)
        if new_leads.email != "NULL":
            found += 1
    print("Total : ", total)
    print("Wins : ", found)
    print("Win % : ", found * 100 / total)
    return "End of the script"


# Run the script

asyncio.run(main())