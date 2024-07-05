## Overview

Req Data Management - by [**Attila Technologies**](https://www.attila-technologies.com/)
<br>This is a tiny API used to get data from a local database and create items in [monday.com](https://try.monday.com/d8x1zdvc4fg5).
<br>See routes details for more information.

## Install and Run

1. Make sure you have Node (v16.16+) and yarn installed

2. Install dependencies with yarn:

```
$ yarn install
```

3. Run the server with:

```
$ yarn start
```

## Environment variables

Follow those steps to make sure your app works well.

1. Create a .env file in your src directory

2. Add these lines to your file:

```
PORT=8080
MONDAY_ACCESS_TOKEN={insert your monday.com access token here}
```

## Routes details

Insert route details here

# Endpoints

## Base

URL Toutes les requêtes à l'API doivent utiliser la base URL suivante : N/D

## Create Monday items

**URL** : `/get-all-items`
**Méthode** : `GET`
**Description** : Cette fonctionnalité prend tous les éléments qui ne sont actuellement pas dans votre CRM Monday et les ajoute à votre CRM.
| Paramètre | Type | Obligatoire | Description |
|-----------|--------|-------------|--------------------------------------------------------------|
| user | string | Oui | ID utilisateur |
| category | int | Non | ID de la catégorie d'entreprise à ajouter à votre CRM |
| mrc | int | Non | ID de la MRC à ajouter à votre CRM |
| limit | int | Non | Limite des leads à ajouter à votre CRM (par défaut à 50) |

## Get Unverified Leads

Ce Features sert à prendre tous les leads que l'algorithme n'a pas été capable de trouver et les envoie vers le CRM pour faire une vérif humaine.

**URL** : `/get-unverified-leads`
**Méthode** : `GET`
**Description** : Cette fonctionnalité ajoute tous les leads que l'algorithme n'a pas pu analyser à votre tableau de vérification des leads Monday.

**URL** : `/update-unverified-leads`
**Méthode** : `PATCH`
**Description** : Met à jour la base de données avec les emails vérifiés manuellement.

## Get unverified secteur

Ce feature prend tous les leads que leur secteur n'est pas dans la table secteur de la base de donnée pour qu'un humain associe le secteur à une catégorie dans le CRM.

**URL** : `/create-verif-secteur`
**Méthode** : `POST`
**Description** : Cette fonctionnalité récupère tous les leads de la table localisation où leur secteur n'est pas dans la table secteur..

**URL** : `/get-unverified-secteur`
**Méthode** : `GET`
**Description** : Met à jour la base de données avec les secteurs vérifiés.

## ID references

Voici une liste de tous les ID que vous pouvez utiliser dans vos parameters.

### MRC:

| ID  | MRC                           |
| --- | ----------------------------- |
| 100 | Capitale-Nationale            |
| 101 | Chaudière-Appalaches          |
| 103 | Montérégie                    |
| 104 | Montréal                      |
| 105 | Lanaudière                    |
| 106 | Laurentides                   |
| 107 | Mauricie                      |
| 108 | Centre-du-Québec              |
| 109 | Outaouais                     |
| 110 | Abitibi-Témiscamingue         |
| 111 | Saguenay–Lac-Saint-Jean       |
| 112 | Bas-Saint-Laurent             |
| 113 | Gaspésie–Îles-de-la-Madeleine |
| 114 | Côte-Nord                     |
| 115 | Nord-du-Québec                |

### Category:

| ID  | MRC                   |
| --- | --------------------- |
| 1   | Construction          |
| 2   | Tourisme              |
| 3   | Agriculture           |
| 4   | Services              |
| 5   | Finance               |
| 6   | Transport             |
| 7   | Technologie           |
| 8   | Commerce and retail   |
| 9   | Art, Cultures, Loisir |
| 10  | Industriel            |
| 11  | Santé                 |
| 12  | Real Estate           |
| 13  | Éducation             |
| 14  | Énergie               |
| 15  | Services Pro          |
