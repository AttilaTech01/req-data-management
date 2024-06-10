import mondayRepository from '../repositories/monday-repository'
import reqRepository from '../repositories/req-database-repository';
import { Business } from '../models/business';
import express, { Request, Response } from 'express';
class ReqService {
  
//  Look how type script work
  static async getAllItems(req: Request): Promise<any> {
    try {
      let queryStr = "SELECT localisation.*, category.nom, mrc.nom, name.Nom FROM localisation JOIN secteurs ON localisation.secteur = secteurs.secteur_name JOIN category ON secteurs.category_id = category.category_id JOIN ville on localisation.ville = ville.ville_name JOIN mrc on ville.mrc_id = mrc.mrc_id Join name on localisation.neq = name.NEQ";
      console.log(req.query)
      const{ category, mrc, limit} = req.query
      
      if (category && mrc) {

        // Add a case to the category name to an id
        queryStr+= ` Where category.category_id = ${category} and mrc.mrc_id = ${mrc}`
      }
        // Parse the interger
      if (limit) {
        queryStr+= ` Limit = ${category} `
      }

      queryStr += ";"


      console.log(queryStr)


      //const limit = ` LIMIT ${req.params}` || ""
      
     // Send the Query STR to the repo


      const result = await reqRepository.getAllItems(queryStr);
      const data = result.data
      //console.log(result)
      
      await mondayRepository.createItem(result)

      

    } catch (error) {
      console.log(error);
      throw error;
    }
  }


// Get all the items with a treshold less than 0.5

  static async getVerifItems(req: Request): Promise<any> {
    try {
      let queryStr = "SELECT DISTINCT localisation.*, category.nom, mrc.nom, name.Nom FROM localisation JOIN secteurs ON localisation.secteur = secteurs.secteur_name JOIN category ON secteurs.category_id = category.category_id JOIN ville on localisation.ville = ville.ville_name JOIN mrc on ville.mrc_id = mrc.mrc_id Join name on localisation.neq = name.NEQ Where localisation.treshold < 0.5";
      






      const result = await reqRepository.getAllItems(queryStr);

      // If there is no result return sucess

      if (result.length === 0) {
        return true 
      }
// Calling the function with a loop or create the Loop directly inside the repo
     await mondayRepository.createVerifItems(result)

      console.log(result)
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}


























export default ReqService;
