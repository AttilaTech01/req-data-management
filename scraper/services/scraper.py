from repo.website_scraping import get_website_info, get_website_url
from repo.facebook_scraping import get_facebook_info
class Scraper:
    def __init__(self, company_name, ) -> None:
        self.company_name = company_name
        self.email_list = []
        self.phone_list = []
        self.website_url = None

    async def website_scraping(self):
        # Get the Website URL
        await get_website_url(self) 
        # Parse the Website
        await get_website_info(self)
        return
    
    async def facebook_scraping(self):
        await get_facebook_info(self)
        return