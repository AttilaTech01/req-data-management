-- Script de la création de la BAse de Donnéexecute
create database leads;
use leads;

Create Table mrc (

mrc_id int NOT NULL,
nom varchar(255),

constraint pk_mrc_id primary key(mrc_id)
);


Create table category (

category_id int NOT NULL,
nom varchar(255),

constraint pk_category_id primary key(category_id)

);

Create Table localisation (
id int NOT NULL auto_increment,
neq int,
secteur varchar(255),
adresse varchar(255),
ville 	varchar(255),
téléphone int NULL ,
courriel varchar(255),
treshold int,
migration boolean DEFAULT FALSE,
date_creation date,

constraint pk_id primary key(id)
);


create table name (

id int  auto_increment  NOT NULL,
NEQ int,
Nom varchar(255),

constraint pk_ent_nom primary key(id)
);





Create table secteurs (

id int auto_increment NOT NULL,
secteur_name varchar(255),
category_id int,

constraint fk_secteur_cat_id foreign key(category_id) references category(category_id),
constraint pk_sec_id primary key(id)

);


Create table ville (

id int auto_increment NOT NULL,
ville_name varchar(255),
mrc_id int,

constraint fk_ville_mrc_id foreign key(mrc_id) references mrc(mrc_id),
constraint pk_ville_mrc_id primary key(id)

);



INSERT INTO mrc Values (100, "Capitale-Nationale"),
						(101, "Chaudière-Appalaches"),
                        (102, "Estrie"),
                        (103, "Montérégie"),
                        (104, "Montréal"),
                        (105, "Lanaudière"),
                        (106, "Laurentides"),
                        (107, "Mauricie "),
                        (108, "Centre-du-Québec"),
                        (109, "Outaouais"),
                        (110, "Abitibi-Témiscamingue"),
                        (111, "Saguenay–Lac-Saint-Jean"),
                        (112, " Bas-Saint-Laurent"),
                        (113, "Gaspésie–Îles-de-la-Madeleine"),
                        (114, "Côte-Nord"),
                        (115, "Nord-du-Québec");










INSERT INTO category VALUES
(1, 'Construction'),
(2, 'Tourisme'),
(3, 'Agriculture'),
(4, 'Services'),
(5, 'Finance'),
(6, 'Transport'),
(7, 'Technologie'),
(8, 'Commerce and retail'),
(9, 'Art, Cultures, Loisir'),
(10, 'Industriel'),
(11, 'Santé'),
(12, 'Real Estate'),
(13, 'Éducation'),
(14, 'Énergie'),
(15, 'Services Pro'); 














-- Query de recherche

 Select localisation.id, localisation.neq, localisation.secteur, localisation.adresse, localisation.ville, localisation.category_id, localisation.mrc_id, mrc.nom, name.Nom, category.nom, monday.board_id
 from localisation
 inner JOIN category on  localisation.category_id = category.category_id
 Inner Join mrc on localisation.mrc_id = mrc.mrc_id
 Inner Join name on localisation.neq = name.NEQ
 Inner join monday on localisation.category_id = monday.category_id and localisation.mrc_id = monday.mrc_id;
 
 
 -- query pour avoir le category_id
 -- obtenir le catégory_id 
Select s.category_id 
from localisation l
join secteurs s  on l.secteur = s.secteur_name;
 
 
 
 
 
 -- Query supprimer les compagnies à chiffres
 
 -- Delete les compagnies à chiffres
set sql_safe_updates = 0;
delete
from name
Where Nom regexp '^[0-9]{3}.';


-- Main Query
SELECT 
    localisation.*,
    category.nom,
    mrc.nom,
    name.Nom "Company_name"
FROM 
    localisation
JOIN 
    secteurs ON localisation.secteur = secteurs.secteur_name
JOIN 
    category ON secteurs.category_id = category.category_id
JOIN
	ville on localisation.ville = ville.ville_name
JOIN
	mrc on ville.mrc_id = mrc.mrc_id
Join name on localisation.neq = name.NEQ   
WHERE category.category_id = 1 and mrc.mrc_id = 101;


SELECT 
    localisation.*,
    category.nom,
    mrc.nom
FROM 
    localisation
JOIN 
    secteurs ON localisation.secteur = secteurs.secteur_name
JOIN 
    category ON secteurs.category_id = category.category_id
JOIN
	ville on localisation.ville = ville.ville_name
JOIN
	mrc on ville.mrc_id = mrc.mrc_id
Join name on localisation.neq = name.NEQ
WHERE category.category_id = 1 and mrc.mrc_id = 101 and localisation.treshold < 0.5;
















INSERT INTO secteurs (secteur_name, category_id) VALUES
('Travaux d\'électricité', 1),
('Entrepreneur en construction', 1),
('Travaux de plomberie', 1),
('Électricité', 1),
('Rénovation de maison', 1),
('Déneigement', 1),
('Consultant en construction', 1),
('Rénovation et l\'entretien résidentiel et commercial', 1),
('Excavation', 1),
('Construction immobilières', 1),
('Entrepreneur en construction et gestion d\'immeubles résidentiels', 1),
('Installation de gouttières en aluminium', 1),
('Carreleurs', 1),
('Consultation et services techniques en construction', 1),
('Plomberie', 1),
('Reconditionnement de fenêtres', 1),
('Construction et promotion de maisons neuves', 1),
('Constructions', 1),
('Travaux de coffrage industriels & commerciaux', 1),
('Fabrication de portes d\'acier et de fenêtres en upvc', 1),
('Construction et rénovation commerciale', 1),
('Travaux d\'ingénierie', 1),
('Traçage de lignes sur pavé', 1),
('Installation et vente de systèmes d\'alarme', 1),
('Entrepreneur général en construction', 1),
('Rénovation résidentielle et commerciale', 1),
('Construction d\'immeubles résidentiels et commerciaux', 1),
('Construction de maisons pré-fab', 1),
('Travaux paysagers', 1),
('Exploitation d\'une entreprise dans le domaine de la construction', 1),
('Construction résidentielle', 1),
('Lever les bâtisses', 1),
('Services de construction', 1),
('Entrepreneur général et spécialisé', 1),
('Soudure haute-pression', 1);


















INSERT INTO secteurs (secteur_name, category_id) VALUES
('Agence de voyages', 2),
('Magasin de souvenirs', 2),
('Exploitation d\'un bar', 2),
('Restaurant', 2),
('Restaurant avec permis d\'alcool', 2),
('Organiser des tournois de golf', 2),
('Hotellerie et restauration', 2),
('Entreprise de services en voyages', 2),
('Organisation de voyages en autobus et en avion', 2),
('Bistro', 2),
('Restaurant licencié', 2),
('Restaurant & bar', 2),
('Exploite un restaurant', 2),
('Opération d\'un restaurant', 2),
('Service de bar', 2),
('Croisière touristique et transport de passagers par bateau', 2),
('Location de chalets', 2),
('Mini golf', 2),
('Pourvoirie', 2),
('Croisière écologique', 2),
('Restaurant traiteur pois mange tout', 2),
('Restaurant sans permis d\'alcool', 2);









INSERT INTO secteurs (secteur_name, category_id) VALUES
('Travaux forestiers', 3),
('Aviculture (98%)', 3),
('Grande culture', 3),
('Cultures de céréales', 3),
('Ferme laitière', 3),
('Vente de viande de boucherie', 3),
('Vaches laitières', 3),
('Ferme porcine', 3),
('Exploitations forestières', 3),
('Exploitation érablière', 3),
('Élevage de porcs', 3),
('Élevage d\'agneaux', 3),
('Production laitière et de céréales', 3),
('Exploitation d\'une ferme laitière', 3),
('Ferme céréalière et maraîchère', 3),
('Ferme céréalière', 3),
('Culture maraîchère et grande culture', 3),
('Mytiliculture (élevage des moules)', 3),
('Exploitation agricole', 3),
('Production de sirop d\'érable', 3),
('Verger', 3),
('Production ovine', 3),
('Ferme de production laitière', 3);




INSERT INTO secteurs (secteur_name, category_id) VALUES
('Résidence pour personnes âgées', 4),
('Centre de langue seconde', 4),
('Traiteur spécialisé', 4),
('Service d\'entretien ménager', 4),
('Collecte d\'ordure', 4),
('Communication-marketing', 4),
('Réparation mécanique et réparation de carrosseries', 4),
('Entretien ménager', 4),
('Émondage', 4),
('Fruiterie', 4),
('Gestion santé et sécurité', 4),
('Car wash', 4),
('Opération d\'appareils récréatifs', 4),
('Vente de publicité', 4),
('Representants de medias', 4),
('Physiothérapeute', 4),
('Prise et transcription sténographiques', 4),
('Nettoyage à sec buanderie', 4),
('Photographe', 4),
('Service de réfrigération (15.10 )', 4),
('Livraisons de nourriture', 4),
('Organisation de voyages en autobus et en avion', 4),
('Centre de vinification', 4),
('Distribution de compartiments et d\'accessoires de toilette', 4),
('Service de restauration', 4),
('Centre d\'entraînement', 4),
('Enquête spécialisée', 4),
('Administrateur de salles d\'amusement', 4),
('Livraison de colis', 4),
('Garage de mécanique générale', 4),
('Exploitation d\'un casse-croûte', 4),
('Vente de lunettes et produits connexes', 4),
('Services de messagerie - services de livraison', 4),
('Garderie pour enfants', 4),
('Salon funéraires', 4),
('Recherches médicales', 4),
('Nettoyage de voitures', 4),
('Remplissage de terrains', 4),
('Salle de danse', 4),
('Exploitation d\'une résidence pour personnes âgées', 4),
('Services divers fournis aux entreprises', 4),
('Location de systèmes de son', 4),
('Service consultant en réfrigération', 4),
('Service comptable', 4),
('Service d\'installation d\'armoires et mobilier intégré', 4),
('Centre d\'hébergement pour adultes', 4),
('Blanchissage ou nettoyage à sec', 4),
('Centre de gestion', 4),
('Services de gestion', 4),
('Service architecture', 4),
('Ingénierie en télécommunications', 4),
('Gestion de campagnes de communication (agence de publicité)', 4),
('Conseil & recherche marketing', 4),
('Fondation', 4),
('Perception de fonds & fournir une aide financière à des org. de charité', 4),
('Messagerie / transport de colis', 4);



INSERT INTO secteurs (secteur_name, category_id) VALUES
('Société de portefeuille 100%', 5),
('Placement', 5),
('Placements', 5),
('Corporation de placements', 5),
('Compagnie de portefeuille', 5),
('Sociétés de portefeuille', 5),
('Investissement et de placements', 5),
('Unactive holding', 5),
('Holding (compagnie de gestion)', 5),
('Investissements', 5),
('Société de portefeuille (holdings)', 5),
('Gestion de placement', 5),
('Investissement', 5),
('Gestion financière', 5),
('Conseiller en valeurs & gestionnaire de portefeuille', 5),
('Détention et gestion d\'immeubles', 5),
('Gestion de placements', 5),
('Placements gestion', 5),
('Administre des placements', 5),
('Corporation de gestion', 5),
('Compagnie d\'investissement et de portefeuille', 5),
('Compagnie de placement', 5),
('Compagnie portefeuilles', 5),
('Société de placement (holding)', 5),
('Gestion (société de portefeuille)', 5),
('Société de placements', 5),
('Holding company', 5);







INSERT INTO secteurs (secteur_name, Category_id) VALUES
('Transport de marchandise', 6),
('Transport par remorquage', 6),
('Sous-transporteur de lots brisés au Québec (anglais=ltl)', 6),
('Transport de marchandises', 6),
('Entreprise de camionnage long parcours', 6),
('Transport de bois', 6),
('Transport international', 6),
('Transport de matières en vrac', 6),
('Escorte en transport', 6),
('Service de livraison de courrier', 6),
('Location d\'automobiles', 6),
('Transport par camion de marchandise', 6),
('Transport de marchandise à l\'aide d\'un camion', 6),
('Transportation', 6),
('Transport général sous-traitance en transport', 6),
('Trucking company', 6),
('Transport général', 6),
('Transport scolaire', 6),
('Transport (général)', 6),
('Drive truck', 6),
('Vente et réparations de camions', 6),
('Réparation-entretien mécanique de camion diésel', 6),
('Camionnage', 6),
('Transport commercial par avion', 6),
('Compagnie de transport', 6);

INSERT INTO secteurs (secteur_name, Category_id) VALUES
('Computer dealer', 7),
('Vente et réparation de radio portatif & mobile', 7),
('Eau traitée par osmose inversé', 7),
('Production de logiciels informatiques', 7),
('Automatisation industrielle et commerciale', 7),
('Technicien en architecture', 7),
('Informatique et communication', 7),
('Consultant en informatique', 7),
('Développement de logiciels linguistiques', 7),
('Développement de logiciels', 7),
('Consultation en informatique', 7),
('Vente et service en informatique et électronique', 7),
('Vente et service en informatique et électronique', 7),
('Vente et service d\'équipements industriels', 7),
('Vente et réparation de petits appareils ménagers', 7),
('Installation de produits électroniques', 7),
('Installation de système de ventilation', 7),
('Vente et installation de câblage pour réseaux informatiques', 7),
('Fabrication et distribution des produits destinés aux réseaux de distribution électrique', 7),
('Production manufacturière & intégration de systèmes (secteur domotique/maintien domicile)', 7),
('Vente de logiciels informatiques', 7),
('Vente de services informatiques (incluant installation)', 7);



INSERT INTO secteurs (secteur_name, Category_id) VALUES
('Fabrication de jouets de bois', 8),
('Détaillant de fournitures de bureau', 8),
('Retail new and used women\'s wear', 8),
('Vente de vêtements de sports en gros', 8),
('Vente et service de machinerie lourde', 8),
('Achat et vente de camions et de machinerie lourde', 8),
('Broderie', 8),
('Vente de terre', 8),
('Vêtements sports pour enfants vêtements scolaires (uniformes)', 8),
('Confection de vêtements', 8),
('Vente au détail de vêtements pour hommes', 8),
('Achat et vente de tissus et matériel de couture', 8),
('Vente au détail d\'article de sport', 8),
('Lingerie', 8),
('Vente de vêtements pour dames', 8),
('Commerce au détail de vêtements sports', 8),
('Dépanneur', 8),
('Fournisseur de vêtements', 8),
('Ventes et location des vidéocassettes', 8),
('Vente au détail', 8),
('Centre horticole (vente au détail de produits horticoles)', 8),
('Vente et distribution de produits d\'escalade', 8),
('Vente au détail de produits cosmétiques', 8),
('Vente de pièces d\'autos', 8),
('Confection de bijoux en gros import/export', 8),
('Vente au détail d\'articles reliés aux sports de raquettes', 8),
('Vente de véhicules automobiles neufs ou usagés', 8),
('Vente essence', 8),
('Vente de café', 8),
('Vente de vêtements', 8),
('Vente au détail et en gros d\'articles de sport', 8),
('Commerce de détails (épicerie)', 8),
('Vente de plomberie industrielle', 8),
('Vente à commission de cadeaux', 8),
('Vente à commission', 8),
('Vente au détail dans le domaine des télécommunications et service au client', 8),
('Commerce de détail (magasin à rayons)', 8),
('Encadrement-détail (et en gros)', 8),
('Achat et vente de produits marins', 8),
('Commerce', 8),
('Maison de commerce', 8),
('Vente et service d\'équipements industriels', 8),
('Alimentation (dépanneur provi-soir)', 8),
('Commerce et distribution', 8),
('Vente de vêtements au détail', 8),
('Vente de vêtements pour dames', 8),
('Commerce d\'épicerie', 8),
('Vente d\'animaux - nourriture - accessoires', 8),
('Vente de tissus et toutes autres activités connexes', 8),
('Vente automobiles usagées', 8),
('Vente en détail - marchandises variables', 8),
('Bijouterie', 8),
('Vente de voitures neuves et usagées', 8),
('Vente de véhicules récréatifs', 8),
('Commerce de détail de vêtements de sport', 8);



INSERT INTO secteurs (secteur_name, Category_id) VALUES
('Broderie', 9),
('Peintres artisans', 9),
('Graphisme', 9),
('Publicité', 9),
('Arts graphiques', 9),
('Publicité par objet', 9),
('Opérations de jeux automatiques', 9),
('Club vidéo', 9),
('Production d\'œuvre scénographique', 9),
('Édition', 9),
('Activités artistiques', 9);



INSERT INTO secteurs (secteur_name, Category_id) VALUES
('Structures métalliques', 10),
('Ébénisterie', 10),
('Fabrication de prothèses et d\'orthèses', 10),
('Préparation de composantes de bois industriel', 10),
('Distribution de produits chimiques', 10),
('Manufacturier et distributeur de produits d\'automobiles', 10),
('Imprimerie', 10),
('Fabrication d\'armoires de cuisine', 10),
('Fabrication et vente de composantes pour baignoires', 10),
('Manufacture des manteaux & jacquettes de cuir', 10),
('Fabrication de meubles', 10),
('Fabrication & vente de vêtements', 10),
('Transformation matières premières (scierie)', 10),
('Distribution d\'appareils électriques', 10),
('Fabrication de vêtements pour dames', 10),
('Import export', 10),
('Importation', 10),
('Fabrication de matelas et sommiers', 10),
('Atelier de laminage (pelliculage)', 10),
('Fabrication de contre-plaqué galbé (curved plywood)', 10),
('Démontage & installation d\'équipement industriel', 10),
('Distribution de panneaux isolants', 10),
('Signalisation routière', 10);


INSERT INTO secteurs (secteur_name, Category_id) VALUES
('Résidence pour personnes âgées', 11),
('Physiothérapeute', 11),
('Energy conservation consultant and delivery of energy cons. prog. for utilities', 11),
('Assureur-vie', 11);


INSERT INTO secteurs (secteur_name, Category_id) VALUES
('Immobilier', 12),
('Propriétaire foncier', 12),
('Consultants en immobiliers', 12),
('Gestion immobilière', 12),
('Gestion multi logements résidentiels', 12),
('Achat - vente de terrain', 12),
('Courtage immobilier', 12),
('Real estate (location)', 12),
('Location d\'immeubles', 12),
('Location locaux', 12),
('Placements immobiliers et gestion', 12),
('Services d\'évaluation et de gestion immobilière et autres services connexes', 12),
('Construction immobilières', 12),
('Construction et promotion de maisons neuves', 12),
('Consultants en santé et sécurité du travail', 12),
('Location d\'espaces commerciaux et industriels', 12),
('Location d\'un terrain', 12),
('Immeuble commercial', 12),
('Détention et gestion d\'immeubles', 12),
('Location d\'immeubles résidentiels', 12),
('Property real estate buy & sale rental', 12),
('Commissions pour la vente d\'immeubles', 12),
('Location de biens immeubles et d\'équipements', 12),
('Location de locaux', 12),
('Revenus locatifs (bureaux et locaux industriels)', 12);


INSERT INTO secteurs (secteur_name, Category_id) VALUES
('Centre de langue seconde', 13),
('Association d\'étudiants', 13),
('Formation en bureautique', 13),
('Éducation préscolaire', 13),
('Garderie', 13);




INSERT INTO secteurs (secteur_name, Category_id) VALUES
('Centre de recherche sur l\'énergie', 14);



INSERT INTO secteurs (secteur_name, Category_id) VALUES
('Consultant en genie mecanique - gestion de projets', 15),
('Société de gestion', 15),
('Compagnie de gestion (holding)', 15),
('Compagnie de gestion', 15),
('Consultant en aménagement', 15),
('Activité de gestion', 15),
('Gestion et formation', 15),
('Cabinet multidisciplinaire en assurances de personnes et de dommages', 15),
('Entreprise de gestion', 15),
('Le seul immeuble qui faisait état de ce code d\'activité a été vendu le 9 septembre 2020.', 15),
('Activités indéterminées et imprécises', 15),
('Consultation', 15),
('Consultants en santé et sécurité du travail', 15),
('Vente de produits d\'assurance de personnes', 15),
('Consultants en santé et sécurité du travail', 15),
('Gestion de placements', 15),
('Conseils en gestion des affaires', 15),
('Traduction de manuel de l\'anglais au français', 15),
('Conseillers matrimoniaux', 15),
('Administrateur de salles d\'amusement', 15),
('Tenue de livres', 15),
('Conseils en gestion des affaires', 15),
('Consultante en assurance', 15),
('Consultant en marketing', 15),
('Consultant en réfrigération', 15),
('Consultant en informatique', 15),
('Service consultant en réfrigération', 15),
('Publicité marketing', 15),
('Services de gestion', 15),
('Service d\'installation d\'armoires et mobilier intégré', 15),
('Services divers fournis aux entreprises', 15),
('Ingénierie en télécommunications', 15),
('Service comptable', 15),
('Gestion de campagnes de communication (agence de publicité)', 15);




-- Script d'insertion des villes

-- Capitale-Nationale
INSERT INTO ville (ville_name, mrc_id) VALUES 
('QUÉBEC', 100),
('Ancienne-Lorette (Québec)', 100),
('ANCIENNE-LORETTE (Québec)', 100),
('Saint-Augustin-de-Desmaures (Québec)', 100),
('SAINT-AUGUSTIN DE DESMAURES (QUÉBEC)', 100),
('Stoneham-et-Tewkesbury (Québec)', 100),
('Stoneham (Québec)', 100);

-- Chaudière-Appalaches
INSERT INTO ville (ville_name, mrc_id) VALUES 
('Lévis (Québec)', 101),
('Saint-Romuald (Québec)', 101),
('SAINT-ROMUALD (QUÉBEC)', 101),
('Sainte-Marie (Québec)', 101),
('SAINTE-MARIE QC', 101),
('Saint-Georges (Québec)', 101),
('Saint-Georges QC', 101),
('Thetford Mines (Québec)', 101),
('THETFORD MINES QC', 101),
('Saint-Apollinaire (Québec)', 101),
('St-Apollinaire (Québec)', 101),
('Beauceville (Québec)', 101),
('Saint-Joseph-de-Beauce (Québec)', 101);

-- Estrie
INSERT INTO ville (ville_name, mrc_id) VALUES 
('Sherbrooke (Québec)', 102),
('SHERBROOKE QC', 102),
('Magog (Québec)', 102),
('MAGOG QC', 102),
('Coaticook (Québec)', 102),
('East Angus (Québec)', 102),
('Windsor (Québec)', 102),
('Granby (Québec)', 102),
('GRANBY QC', 102);

-- Montérégie
INSERT INTO ville (ville_name, mrc_id) VALUES 
('Longueuil (Québec)', 103),
('Brossard (Québec)', 103),
('BROSSARD QC', 103),
('Saint-Hyacinthe (Québec)', 103),
('Saint-Jean-sur-Richelieu (Québec)', 103),
('Saint-Jean Sur Richelieu (Québec)', 103),
('Boucherville (Québec)', 103),
('Saint-Bruno-de-Montarville (Québec)', 103),
('St Bruno de Montarville (Québec)', 103);

-- Montréal
INSERT INTO ville (ville_name, mrc_id) VALUES 
('Montréal (Québec)', 104),
('MONTREAL (QUÉBEC)', 104),
('MONTRÉAL QC', 104),
('Laval (Québec)', 104),
('LAVAL QC', 104),
('Pointe-Claire (Québec)', 104),
('Anjou (Québec)', 104),
('ANJOU QC', 104),
('Dorval (Québec)', 104),
('Saint-Laurent (Québec)', 104),
('Ville Saint-Laurent (Québec)', 104),
('Côte-Saint-Luc (Québec)', 104),
('Cote St. Luc (Québec)', 104),
('CÔTE SAINT-LUC (Québec)', 104);

-- Lanaudière
INSERT INTO ville (ville_name, mrc_id) VALUES 
('Joliette (Québec)', 105),
('Saint-Lin-Laurentides (Québec)', 105),
('Repentigny (Québec)', 105),
('Terrebonne (Québec)', 105),
('Mascouche (Québec)', 105);

-- Laurentides
INSERT INTO ville (ville_name, mrc_id) VALUES 
('Saint-Jérôme (Québec)', 106),
('St-Jérôme (Québec)', 106),
('Blainville (Québec)', 106),
('BLAINVILLE QC', 106),
('Sainte-Thérèse (Québec)', 106),
('Mirabel (Québec)', 106),
('Saint-Eustache (Québec)', 106);

-- Mauricie
INSERT INTO ville (ville_name, mrc_id) VALUES 
('Trois-Rivières (Québec)', 107),
('Trois-Rivières QC', 107),
('Shawinigan (Québec)', 107),
('Louiseville (Québec)', 107),
('La Tuque (Québec)', 107);

-- Centre-du-Québec
INSERT INTO ville (ville_name, mrc_id) VALUES 
('Drummondville (Québec)', 108),
('DRUMMONDVILLE QC', 108),
('Victoriaville (Québec)', 108),
('Plessisville (Québec)', 108);

-- Outaouais
INSERT INTO ville (ville_name, mrc_id) VALUES 
('Gatineau (Québec)', 109),
('Chelsea (Québec)', 109),
('Shawville (Québec)', 109),
('Papineauville (Québec)', 109);

-- Abitibi-Témiscamingue
INSERT INTO ville (ville_name, mrc_id) VALUES 
('Rouyn-Noranda (Québec)', 110),
('ROUYN-NORANDA QC', 110),
("Val-d'Or (Québec)", 110),
('Amos (Québec)', 110),
('AMOS QC', 110),
('La Sarre (Québec)', 110);

-- Saguenay–Lac-Saint-Jean
INSERT INTO ville (ville_name, mrc_id) VALUES 
('Saguenay (Québec)', 111),
('Chicoutimi (Québec)', 111),
('Jonquière (Québec)', 111),
('Alma (Québec)', 111),
('Dolbeau-Mistassini (Québec)', 111),
('Roberval (Québec)', 111);

-- Bas-Saint-Laurent
INSERT INTO ville (ville_name, mrc_id) VALUES 
('Rimouski (Québec)', 112),
('Rivière-du-Loup (Québec)', 112),
('Rivière du Loup (Québec)', 112),
('Matane (Québec)', 112),
('Mont-Joli (Québec)', 112),
('MONT-JOLI QC', 112);

-- Gaspésie–Îles-de-la-Madeleine
INSERT INTO ville (ville_name, mrc_id) VALUES 
('Gaspé (Québec)', 113),
('GASPÉ QC', 113),
('Percé (Québec)', 113),
('Carleton-sur-Mer (Québec)', 113),
('Îles-de-la-Madeleine (Québec)', 113),
('ILES-DE-LA-MADELEINE QC', 113);

-- Côte-Nord
INSERT INTO ville (ville_name, mrc_id) VALUES 
('Baie-Comeau (Québec)', 114),
('Sept-Îles (Québec)', 114),
('Port-Cartier (Québec)', 114),
('Havre-Saint-Pierre (Québec)', 114),
('HAVRE ST-PIERRE QC', 114);

-- Nord-du-Québec
INSERT INTO ville (ville_name, mrc_id) VALUES 
('Chibougamau (Québec)', 115),
('Kuujjuaq (Québec)', 115),
('KUUJJUAQ QC', 115);

update localisation
set treshold =0.4
where id = 89211;


select * from localisation;
Select localisation.telephone, localisation.email, localisation.treshold, localisation.id, localisation.neq, name.nom from name inner join localisation on name.NEQ = localisation.neq;
select * from localisation order by neq asc;
select * from name order by NEQ asc;

Select DISTINCT localisation.telephone, localisation.email, localisation.treshold, name.Nom, localisation.id from localisation Inner JOIN name on localisation.neq = name.NEQ and localisation.email is NULL LIMIT 10;

select * from localisation where email is not null and email != "INVALID";




update localisation
set email = "INVALID"
where email = "VERIF"; 

select * from localisation order by neq asc;




select from localisation where neq = 1143681329;