import mondayRepository from '../repositories/monday-repository'
import reqRepository from '../repositories/req-database-repository';
import { Business } from '../models/business';
import express, { Request, Response } from 'express';
import { after } from 'node:test';
import MondayRepository from '../repositories/monday-repository';
class ReqService {
  
//  Look how type script work
  static async getAllItems(req: Request): Promise<any> {
    try {
      let queryStr = "SELECT DISTINCT category.nom as 'Category', localisation.email, localisation.id, localisation.neq, localisation.secteur, localisation.adresse, localisation.ville, localisation.mrc_id, category.nom, mrc.nom, name.Nom FROM localisation JOIN secteurs ON localisation.secteur = secteurs.secteur_name JOIN category ON secteurs.category_id = category.category_id JOIN ville on localisation.ville = ville.ville_name JOIN mrc on ville.mrc_id = mrc.mrc_id Join name on localisation.neq = name.NEQ   "

      const{ category, mrc, limit} = req.query
      
      if (category && mrc) {

        // Add a case to the category name to an id
        queryStr+= ` Where category.category_id = ${category} and mrc.mrc_id = ${mrc} and localisation.email is not null and localisation.email != "INVALID" and localisation.migration is null`
      }
        // Parse the interger
      if (limit) {
       queryStr+= ` Limit ${limit} `
       
      }

      queryStr += ";"


      console.log(queryStr)


      
      
     // Send the Query STR to the repo


      const result = await reqRepository.getAllItems(queryStr);
      
      console.log(result)

    
      if (result.length === 0) {
        return true 
      }

      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        
        await mondayRepository.createItem(element)
        
        // Updating the status of the item
        const updateQuery =`
          update localisation set migration = true where id = ${element.id}
          `
       await reqRepository.getAllItems(updateQuery)
      }

      } catch (error) {
     console.log(error);
     throw error;
   }
  }


// Get all the items with a treshold less than 0.5

  static async getVerifItems(req: Request): Promise<any> {
    try {
      let queryStr = "SELECT DISTINCT localisation.*, category.nom, mrc.nom, name.Nom FROM localisation JOIN secteurs ON localisation.secteur = secteurs.secteur_name JOIN category ON secteurs.category_id = category.category_id JOIN ville on localisation.ville = ville.ville_name JOIN mrc on ville.mrc_id = mrc.mrc_id Join name on localisation.neq = name.NEQ Where localisation.treshold < 0.5 and localisation.email = 'INVALID'";
      


      const result = await reqRepository.getAllItems(queryStr);
      console.log(result)
      // If there is no result return sucess

      if (result.length === 0) {
        return true 
      }
// Calling the function with a loop or create the Loop directly inside the repo
      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        await mondayRepository.createVerifItems(element)
      }

     

      
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }



// Function that create secteur that are not verified to monday

  static async getNonVerifSecteurs(req: Request): Promise<any> {
    try {
      let queryStr = "select distinct localisation.secteur from localisation where localisation.secteur not in (select distinct secteur_name from secteurs) and localisation.secteur  != '-';"

      const result = await reqRepository.getAllItems(queryStr);

      if (result.length === 0) {
        return true 
      }

      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        
        console.log(element)
        await mondayRepository.createNotVerifiedSecteur(element)

      }

// Calling the function with a loop or create the Loop directly inside the repo
    
      console.log(result)
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

// Functions that Insert secteur to the DB and change the monday status
  static async UpdateNonVerifSecteurs(req: Request): Promise<any> {
    try {
      
      const VerifObject = await MondayRepository.getMondayVerifiedSecteur()
      
      const verifiedItems = VerifObject.data.items_page_by_column_values.items
      
      for (let index = 0; index < verifiedItems.length; index++) {
        const element = verifiedItems[index];
        
        // Get the ID opf the category
        console.log(element)
        
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
// Create the query Strings
     // console.log(element.name)
  
      const queryStr = `INSERT INTO secteurs(secteur_name, category_id) values('${element.name}', ${element.column_values[1].text})`
      
      // Insert into the database the new secteurs
      
      await reqRepository.getAllItems(queryStr)
      // change the status of the item
      await  mondayRepository.UpdateVerifiedSecteurStatus(element)
      }

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async UpdateVerifiedLeadsDb(req: Request): Promise<any> {
    try {
      
      const verifiedLeadsObject = await mondayRepository.getMondayVerifiedLeads()
      const verifiedLeads = verifiedLeadsObject.data.items_page_by_column_values.items
      for (let index = 0; index < verifiedLeads.length; index++) {
        const element = verifiedLeads[index];

        const queryStr = `UPDATE localisation set email=${element.column_values[3].text} where id = ${element.column_values[2].text} `
        // Update the Database
        await reqRepository.getAllItems(queryStr)
        console.log("This ID")
        console.log(element.id)
        await mondayRepository.UpdateVerifiedLeadsStatus(element.id)
      }
      
      //console.log(verifiedLeads)

      return true;
      } catch (error) {
      console.log(error);
      throw error;
    }
  }
 








}


























export default ReqService;
