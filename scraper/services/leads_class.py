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
            # if only one email, return it
            if len(list_email) == 1:
                email_result = validate_company_name(self.company_name, list_email[0])
                self.email = email_result[0]
                self.treshold = email_result[1]
                return 
            
            #Input list of email then in validate it and retur a list of tuples of [email, trehsolg]
            emails_verfied = []
            for email in list_email:
                email_result = validate_company_name(self.company_name, email)
                #Check if a keyword is found
                if found_emails_formatting(email):
                    self.email= email_result[0]
                    self.treshold = email_result[1]
                    return
                emails_verfied.append(email_result)

            # Trouver le tuple avec le plus haut treshold
            max_email = None
            max_treshold = 0
            print("This is emails_verified", emails_verfied)
            for verified_email in emails_verfied:
                if verified_email[1] > max_treshold:
                    max_treshold = verified_email[1]
                    max_email = verified_email[0]
            print("This is max treshold",max_treshold)
            self.email = max_email
            self.treshold = max_treshold
        return

    def leads_validation(self):
        if self.email == None:
            self.email = "INVALID"
        if self.telephone == None:
            self.telephone = "NULL"
        return