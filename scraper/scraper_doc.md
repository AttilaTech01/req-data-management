# Scraper

Bienvenue dans la documentation du script de recherche d'email de l'app REQ-DATA-Management

## Architecture

L'application est structurer de cette manière Main-> Services -> Repo.

### Main

**Main:** Le Fichier Main est le fichier mère qui éxécute toutes les services dans l'ordre. Il instancie l'objet leads ainsi que l'objet Scraper puit il s'occupe de lancer les méthodes de ces objets. Voici un un schéma qui représente les étapes de Main.:

### Services

Le dossier services contient 2 fichier qui sont les deux services de l'application;

**Leads**
Le fichier Leads s'occupe de créer un objet qui représente la compagnie en cours de Scraping.
La class leads s'occupe aussi des la validation ainsi que la vérification des données trouver dans le Scraping.

**Méthode**
Voici les méthodes de la class Leads.

format_name : Elle s'occupe d'enlever les mots clés ["INC, ENR"] du nom de la compagnie et elle transfomer le nom en lettres minuscule.

email_verification: Elle prend une list d'email trouvé et s'occupe d'associer à l'objet leads le email avec le plus haut treshold.

leads_validation: Cette fonction prépare l'objet pour la query, pour cela il regarde si des emails sont trouvés, si aucun ne sont trouvé il met l'email à "INVALID" et si aucun téléphone est trouvé il met le téléphone à "NULL"

**Scraper**
Le fichier Scraper créer un oibjet scraper dans le but de storer les données trouvées pendant le Scraping.

**Méthode**
Voici les méthodes de la class Leads.

website_scraping : Elle s'occupe de trouver l'url du site web et par la suite elle va sur le sit pour essayer de trouver un email et un téléphone.

facebook_scraping: Elle s'occupe de rechercher sur internet le nom de la compagnie et regarder si il y'a un lien Facebook, si il trouve un lien il va sur le lien et recherche pour des emails et des téléphones.
