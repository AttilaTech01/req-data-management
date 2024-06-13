import mondayRepository from '../repositories/monday-repository'
import reqRepository from '../repositories/req-database-repository';
import { Business } from '../models/business';
import express, { Request, Response } from 'express';
import { after } from 'node:test';
import MondayRepository from '../repositories/monday-repository';

class ReqService {
  static async getAllItems(req: Request): Promise<any> {
    try {
      let queryStr = "SELECT DISTINCT category.nom as 'Category', localisation.email, localisation.id, localisation.neq, localisation.secteur, localisation.adresse, localisation.ville, localisation.mrc_id, category.nom, mrc.nom, name.Nom FROM localisation JOIN secteurs ON localisation.secteur = secteurs.secteur_name JOIN category ON secteurs.category_id = category.category_id JOIN ville on localisation.ville = ville.ville_name JOIN mrc on ville.mrc_id = mrc.mrc_id Join name on localisation.neq = name.NEQ";
      const { category, mrc, limit } = req.query;
      
      if (category && mrc) {
        // Add a case to the category name to an id
        queryStr+= ` Where category.category_id = ${category} and mrc.mrc_id = ${mrc} and localisation.email is not null and localisation.email != "INVALID" and localisation.migration is null`
      }
      // Parse the interger
      if (limit) {
        queryStr+= ` Limit ${limit} `; 
      }

      queryStr += ";";

      const result = await reqRepository.customQueryDB(queryStr);
      
      if (result.length === 0) {
        return true;
      }

      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        
        await mondayRepository.createMondayItem(element);
        
        // Updating the status of the DB item
        const updateQuery =`
          update localisation set migration = true where id = ${element.id}
        `;
        await reqRepository.customQueryDB(updateQuery)
      }
    } catch (error) {
     console.log(error);
     throw error;
   }
  }

  // LEADS
  // Get all the items with email=INVALID and a treshold less than 0.5 from the DB
  // Create each of them in monday board (6797870427)
  static async getUnVerifiedLeads(): Promise<any> {
    try {
      let queryStr = "SELECT DISTINCT localisation.*, category.nom, mrc.nom, name.Nom FROM localisation JOIN secteurs ON localisation.secteur = secteurs.secteur_name JOIN category ON secteurs.category_id = category.category_id JOIN ville on localisation.ville = ville.ville_name JOIN mrc on ville.mrc_id = mrc.mrc_id Join name on localisation.neq = name.NEQ Where localisation.treshold < 0.5 and localisation.email = 'INVALID'";
      const result = await reqRepository.customQueryDB(queryStr);
      console.log(result)

      // If there is no result return sucess
      if (result.length === 0) {
        return true 
      }

      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        await mondayRepository.createUnVerifiedLead(element)
        // TODO: update DB status to VERIF
      }

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async UpdateVerifiedLeads(): Promise<any> {
    try { 
      const verifiedLeadsObject = await mondayRepository.getMondayVerifiedLeads();
      const verifiedLeads = verifiedLeadsObject.data.items_page_by_column_values.items;

      for (let index = 0; index < verifiedLeads.length; index++) {
        const element = verifiedLeads[index];
        const queryStr = `UPDATE localisation set email=${element.column_values[3].text} where id = ${element.column_values[2].text}`;

        // Update the Database
        await reqRepository.customQueryDB(queryStr);
        // Update the monday status
        await mondayRepository.UpdateVerifiedLeadStatus(element.id);
      }

      return true;
      } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // SECTEURS
  // Function that create secteur that are not verified to monday
  static async getUnVerifiedSecteurs(): Promise<any> {
    try {
      let queryStr = "select distinct localisation.secteur from localisation where localisation.secteur not in (select distinct secteur_name from secteurs) and localisation.secteur  != '-';"

      const result = await reqRepository.customQueryDB(queryStr);

      if (result.length === 0) {
        return true 
      }

      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        await mondayRepository.createUnVerifiedSecteur(element);
      }

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Functions that Insert secteur to the DB and change the monday status
  static async UpdateVerifiedSecteurs(): Promise<any> {
    try {
      const VerifObject = await MondayRepository.getMondayVerifiedSecteurs();
      const verifiedItems = VerifObject.data.items_page_by_column_values.items
      
      for (let index = 0; index < verifiedItems.length; index++) {
        const element = verifiedItems[index];
        
        // Switch on the ID of the category
        switch (element.column_values[1].text) {
          case "Construction":
              element.column_values[1].text = 1;
              break;
          case "Tourisme":
              element.column_values[1].text = 2;
              break;
          case "Agriculture":
              element.column_values[1].text = 3;
              break;
          case "Services":
              element.column_values[1].text = 4;
              break;
          case "Finance":
              element.column_values[1].text = 5;
              break;
          case "Transport":
              element.column_values[1].text = 6;
              break;
          case "Technologie":
              element.column_values[1].text = 7;
              break;
          case "Commerce and retail":
              element.column_values[1].text = 8;
              break;
          case "Art, Cultures, Loisir":
              element.column_values[1].text = 9;
              break;
          case "Industriel":
              element.column_values[1].text = 10;
              break;
          case "Santé":
              element.column_values[1].text = 11;
              break;
          case "Real Estate":
              element.column_values[1].text = 12;
              break;
          case "Éducation":
              element.column_values[1].text = 13;
              break;
          case "Énergie":
              element.column_values[1].text = 14;
              break;
          case "Services Pro":
              element.column_values[1].text = 15;
              break;
          default:
              
              break;
      }
        const queryStr = `INSERT INTO secteurs(secteur_name, category_id) values('${element.name}', ${element.column_values[1].text})`
        
        // Insert into the database the new secteurs
        await reqRepository.customQueryDB(queryStr);
        // Change the status of the item
        await mondayRepository.UpdateVerifiedSecteurStatus(element);
      }

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


 








}


























export default ReqService;
