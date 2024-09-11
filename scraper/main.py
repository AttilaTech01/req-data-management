import asyncio
from playwright.async_api import async_playwright
from difflib import SequenceMatcher
from datetime import datetime



# Importing my modules
from repo.facebook_scraping import get_facebook_info
from repo.website_scraping import get_website_url, get_website_info
from utils.leads_verif import verification_email, format_name
from repo.database_repo import get_leads_from_database, update_database
from services.scraper import Scraper
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

        #Initialize the Scraper

        scraper =  Scraper(new_leads.company_name)
        
        # Scrape Facebook
        await scraper.facebook_scraping()

        # Scrape the Website

        await scraper.website_scraping()
        # verified which emails to take¸

        new_leads.email_verification(scraper.email_list)
        #Verif Phone Numbers
        new_leads.phone_verification(scraper.phone_list)
        #Verif if any email is found if no changes email object value to "NULL"
        new_leads.leads_validation()
        # Update the Database
        update_database(new_leads)
        if new_leads.email != "INVALID": 
            found += 1
    file = open("log.txt", "a+")
    file.write(f"\n---------------------------------------\nDate : {datetime.today().strftime('%Y-%m-%d %H:%M:%S')}\nTotal : {total} \nWins : {found} \nWin% : {found * 100 / total} \n---------------------------------------")
    

    return "End of the script"
        

# Run the script

asyncio.run(main())