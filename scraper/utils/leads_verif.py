import re
from difflib import SequenceMatcher

# Creating the function to sequalize two strings
def isSimilar(a, b):
    print(f'COMPARING : {a} and {b}')
    result = SequenceMatcher(None, a, b).ratio()
    print(f'RESULT : {result}')
    return result

# Formats the email if it's an array or null
def found_emails_formatting(found_emails):
    KEYWORDS = ["info", "admin", "sales", "ventes", "contact"]
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
def verification_email(emails, leads):
    # Getting verified emails, might be one, might be many
    verified_emails = found_emails_formatting(emails)
    #company_name = format_name(company_name)

    # If only one email is returned
    if isinstance(verified_emails, str):
        # If it didn't find any emails return Invalid
        if verified_emails == "INVALID":
            treshold = 0
            return verified_emails, treshold

        result = validate_company_name(leads.company_name, verified_emails)

        if result >= 0.55 and result > leads.treshold:
            leads.email = verified_emails
            leads.treshold = result
            return True
        else: 
            result = second_validate(leads.company_name, verified_emails)
            if result > leads.treshold:
                leads.email = verified_emails
                leads.treshold = result
            return True


    # If many emails are returned
    best_found_treshold = 0
    best_email = None
    for email in verified_emails:
        if email == "INVALID":
            continue

        result = validate_company_name(leads.company_name, email)

        if result >= 0.55 and result > leads.treshold:
            leads.email = email
            leads.treshold = result
            return True
        else: 
            result = second_validate(leads.company_name, email)
            if result >= 0.45 and result > leads.treshold:
                leads.email = email
                leads.treshold = result
                return True
            else:
                if (result > best_found_treshold):
                    best_found_treshold = result
                    best_email = email
                continue
    
    
    leads.email = best_email
    leads.treshold = best_found_treshold
    return True