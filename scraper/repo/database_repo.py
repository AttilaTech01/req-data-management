import mysql.connector


def get_leads_from_database():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="leads"
    )
    
    query = 'Select DISTINCT l.telephone, l.email, l.treshold, l.company_name, l.id from localisation l JOIN ville v on l.ville = v.ville_name JOIN mrc on v.mrc_id = mrc.mrc_id where l.email is NULL and l.company_name is not NULL and mrc.mrc_id in (100,101,107,108,111,112) LIMIT 50'
    #query = 'Select DISTINCT l.telephone, l.email, l.treshold, l.company_name, l.id from localisation l JOIN ville v on l.ville = v.ville_name JOIN mrc on v.mrc_id = mrc.mrc_id where l.email is NULL and l.company_name is not NULL  LIMIT 50'
    mycursor = mydb.cursor()
    mycursor.execute(query)
    rows= mycursor.fetchall()
    mydb.close()
    return rows


# Updating the database with found values
def update_database(leads):
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        #password="root",
        password="root",
        database="leads"
    )
    rounded_treshold = round(leads.treshold, 2)
    
    query =f'Update localisation set email = "{leads.email}", treshold = {rounded_treshold}, telephone = "{leads.telephone}", company_name = "{leads.company_name}"  where id= {leads.bd_id};'
    print("This the Query", query)
    print(f"6. Updating database item {leads.bd_id} with : {leads.email} - {rounded_treshold} - {leads.telephone} - {leads.company_name}")
    mycursor = mydb.cursor()
    mycursor.execute(query)
    
    mydb.commit()
    mydb.close()
    return True
