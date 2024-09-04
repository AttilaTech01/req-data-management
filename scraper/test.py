import re
texts = ['Diamond Team, Diamond Service', 'Page · Agence spécialisée en immobilier professionnel\n700 Avenue Saint-Croix, Montreal, QC, Canada, Quebec\n(514) 933-6832\ninfo@diamonddiamond.ca\ndiamonddiamond.ca\nFermé\nFourchette de prix · €\nPas encore évalué (2 avis)\ufeff', '', '']

pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
adresses_courriel = []

for text in texts:
    mots = text.split()
    for mot in mots:
    
        if re.match(pattern,mot):
            adresses_courriel.append(mot)

print(adresses_courriel)