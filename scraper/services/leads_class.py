from utils.leads_verif import validate_company_name, format_name, found_emails_formatting


class Leads:
    def __init__(self, company_name, bd_id) -> None:
        self.telephone = None
        self.bd_id = bd_id
        self.treshold = 0
        self.company_name = company_name
        self.email = None 

    def format_name(self):
        self.company_name = format_name(self.company_name)
    def phone_verification(self,phone_list):
        if len(phone_list) > 0:
            self.telephone = phone_list[0]
            return

    def email_verification(self, list_email):
        if len(list_email) > 0:
            # if on email return only one email
            if len(list_email) == 1:
                #IF one result
                email_result = validate_company_name(self.company_name, email)
                self.email = email_result[0]
                self.treshold = email_result[1]
                return 
            
            #Creating a list of tuples to store the data of the 
            emails_verfied = []
            for email in list_email:
                email_result = validate_company_name(self.company_name, email)
                #Check if a keyword is found
                if found_emails_formatting(email):
                    self.email= email
                    return
                emails_verfied.extend(email_result)

            # Trouver le tuple avec le plus haut treshold
            max_email = None
            max_treshold = 0
            for verified_email in emails_verfied:
                if verified_email[1] > max_treshold:
                    max_treshold = verified_email[1]
                    max_email = verified_email[0]
            
            self.email = max_email
            self.treshold = max_treshold
        return

    def leads_validation(self):
        if self.email == None:
            self.email = "INVALID"
        if self.telephone == None:
            self.telephone = "NULL"
        return