import asyncio
from playwright.async_api import async_playwright
import re
from difflib import SequenceMatcher
import mysql.connector

# Importing my modules
from services.facebook_scraping import get_facebook_info
from services.website_scraping import get_website_url, get_website_info
from utils.leads_verif import verification_email, format_name
from repo.database_repo import get_leads_from_database, update_database


class Leads:
    def __init__(self, company_name, bd_id) -> None:
        self.telephone = "NULL"
        self.bd_id = bd_id
        self.treshold = 0
        self.company_name = company_name
        self.email = "INVALID"    


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
        new_leads.company_name = format_name(new_leads.company_name)

        # Trying to get email from FB
        # get_facebook_info return { "email" : company_emails, "phone": company_phone }
        facebook_info = await get_facebook_info(new_leads.company_name)
        print("2. Facebook infos found : ", facebook_info)

        if facebook_info:
            # Process of verification, update the object with the new values
            lead_result = verification_email(facebook_info["email"], new_leads)
            # Update the phone Number if founded
            new_leads.telephone = facebook_info["phone"]
            
            # If the treshold is higher or = 0.5 update the Database
            print("-----------------------------------------------------")
            print(new_leads.treshold)
            print("-----------------------------------------------------")
            if new_leads.treshold >= 0.5:
                
                # update_database(lead_id, email, treshold, telephone)
                #update_database(new_leads.bd_id, new_leads.email, new_leads.treshold, new_leads.telephone)
                print("-----------------------------------------------------")
                continue
             
        # Trying to get website from Google
        website_url = await get_website_url(new_leads.company_name)
        print("3. URL : ",website_url)

        # Trying to get email from the found website
        website_info = await get_website_info(website_url)
        print("4. Web infos : ",website_info)

        # Process of verification
        if website_info:
            lead_result = verification_email(website_info["email"], new_leads)
            found += 1
            
        #update_database(new_leads.bd_id, new_leads.email, new_leads.treshold, new_leads.telephone)
        print("-----------------------------------------------------")
    
    print("Total : ", total)
    print("Wins : ", found)
    print("Win % : ", found * 100 / total)
    return "End of the script"


# Run the script

asyncio.run(main())