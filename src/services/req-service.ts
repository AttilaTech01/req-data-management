import mondayRepository from '../repositories/monday-repository';
import reqRepository from '../repositories/req-database-repository';
import { Business } from '../models/business';
import express, { Request, Response } from 'express';
import { after } from 'node:test';
import mondayConfigService from './monday-config-service';
import { error } from 'node:console';
import { MondayConfig } from '../models/mondayConfig';

class ReqService {
    static async getAllItems(req: Request): Promise<any> {
        //TODO - test with real db
        try {
            const { category, mrc, limit, user } = req.query;

            // Getting monday config informations based on the user
            if (!user || typeof(user) !== "string") {
                return false;
            }
            const userId = mondayConfigService.GetUserDatabaseID(user);

            // Creating the Query
            let queryStr =
                `SELECT DISTINCT c.nom as 'Category', l.email, l.id, l.neq, l.secteur, l.adresse, l.ville, c.nom, mrc.nom, n.Nom FROM localisation l LEFT JOIN migration m ON l.id = m.localisation_id and m.user_id = ${userId} JOIN secteurs s on l.secteur = s.secteur_name JOIN category c on s.category_id = c.category_id JOIN ville v on l.ville = v.ville_name JOIN mrc on v.mrc_id = mrc.mrc_id JOIN name n on l.neq = n.NEQ WHERE m.localisation_id IS NULL and l.email is not null and l.email != 'INVALID'`;
            
            const userConfigInfos: MondayConfig = await mondayConfigService.GetUserConfig(user);

            if (category) {
                // Add a case to the category name to an id
                queryStr += ` and category.category_id = ${category}`;
            }
            if (mrc) {
                // Add a case to the category name to an id
                queryStr += ` and mrc.mrc_id = ${mrc}`;
            }

            queryStr += ` Limit ${limit || 50} `;

            queryStr += ';';

            // Sending the query
            const result = await reqRepository.customQueryDB(queryStr);

            if (result.length === 0) {
                return true;
            }

            for (let index = 0; index < result.length; index++) {
                const element = result[index];

                try {
                    await mondayRepository.createMondayItem(userConfigInfos, element);

                    // Updating the status of the DB item
                    const updateQuery = ` Insert into migration values(${userId}, ${element.id});`;

                    await reqRepository.customQueryDB(updateQuery);
                } catch (error) {
                    throw error;
                }
            }
        } catch (error) {
            throw error;
        }
    }

    // LEADS
    // Get all the items with email=INVALID and a treshold less than 0.5 from the DB
    // Create each of them in monday board (6797870427)
    static async getUnVerifiedLeads(req: Request): Promise<any> {
        try {
            const { user } = req.query;
            if (!user || typeof(user) !== "string") {
                return false;
            }
            const userConfigInfos: MondayConfig = await mondayConfigService.GetUserConfig(user);
            
            let queryStr =
                "SELECT DISTINCT localisation.*, category.nom, mrc.nom, name.Nom FROM localisation JOIN secteurs ON localisation.secteur = secteurs.secteur_name JOIN category ON secteurs.category_id = category.category_id JOIN ville on localisation.ville = ville.ville_name JOIN mrc on ville.mrc_id = mrc.mrc_id Join name on localisation.neq = name.NEQ Where localisation.treshold < 0.5 and localisation.email = 'INVALID' and localisation.email != 'VERIF' LIMIT 10;";
            const result = await reqRepository.customQueryDB(queryStr);

            // If there is no result return sucess
            if (result.length === 0) {
                return true;
            }

            //TODO - test with real db
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                await mondayRepository.createUnVerifiedLead(
                    userConfigInfos.leads_verification.board_id, 
                    userConfigInfos.leads_verification.unverified_group_id, 
                    element, 
                    userConfigInfos.leads_verification.verification_status_column_id, 
                    userConfigInfos.leads_verification.unverified_status_value, 
                    userConfigInfos.leads_verification.db_id_column_id
                );

                // Update Email Status to VERIF
                const updateQueryStr = `update localisation set email = "VERIF" where id= ${element.id};`;
                await reqRepository.customQueryDB(updateQueryStr);
            }

            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async UpdateVerifiedLeads(req: Request): Promise<any> {
        try {
            const { user } = req.query;
            if (!user || typeof(user) !== "string") {
                return false;
            }

            const userConfigInfos: MondayConfig = await mondayConfigService.GetUserConfig(user);

            const verifiedLeadsObject = await mondayRepository.getMondayVerifiedLeads(userConfigInfos.leads_verification.board_id, userConfigInfos.leads_verification.verification_status_column_id, [userConfigInfos.leads_verification.verified_status_value]);
            const verifiedLeads =
                verifiedLeadsObject.data.items_page_by_column_values.items;

            for (let index = 0; index < verifiedLeads.length; index++) {
                const element = verifiedLeads[index];
                const email = mondayConfigService.FindColumnValuefromId(element, userConfigInfos.leads_verification.email_column_id);
                const dbId = mondayConfigService.FindColumnValuefromId(element, userConfigInfos.leads_verification.db_id_column_id);

                const queryStr = `UPDATE localisation set email=${email} where id = ${dbId}`;
                // Update the Database - temporarily DISABLED since we are using test data for the moment
                //await reqRepository.customQueryDB(queryStr);
                // Update the monday status
                await mondayRepository.UpdateVerifiedLeadStatus(userConfigInfos.leads_verification.board_id, element.id, userConfigInfos.leads_verification.verification_status_column_id, userConfigInfos.leads_verification.db_updated_status_value);
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
            let queryStr =
                "select distinct localisation.secteur from localisation where localisation.secteur not in (select distinct secteur_name from secteurs) and localisation.secteur  != '-';";

            const result = await reqRepository.customQueryDB(queryStr);

            if (result.length === 0) {
                return true;
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
            const VerifObject = await mondayRepository.getMondayVerifiedSecteurs();
            const verifiedItems = VerifObject.data.items_page_by_column_values.items;

            for (let index = 0; index < verifiedItems.length; index++) {
                const element = verifiedItems[index];

                // Switch on the ID of the category
                switch (element.column_values[1].text) {
                    case 'Construction':
                        element.column_values[1].text = 1;
                        break;
                    case 'Tourisme':
                        element.column_values[1].text = 2;
                        break;
                    case 'Agriculture':
                        element.column_values[1].text = 3;
                        break;
                    case 'Services':
                        element.column_values[1].text = 4;
                        break;
                    case 'Finance':
                        element.column_values[1].text = 5;
                        break;
                    case 'Transport':
                        element.column_values[1].text = 6;
                        break;
                    case 'Technologie':
                        element.column_values[1].text = 7;
                        break;
                    case 'Commerce and retail':
                        element.column_values[1].text = 8;
                        break;
                    case 'Art, Cultures, Loisir':
                        element.column_values[1].text = 9;
                        break;
                    case 'Industriel':
                        element.column_values[1].text = 10;
                        break;
                    case 'Santé':
                        element.column_values[1].text = 11;
                        break;
                    case 'Real Estate':
                        element.column_values[1].text = 12;
                        break;
                    case 'Éducation':
                        element.column_values[1].text = 13;
                        break;
                    case 'Énergie':
                        element.column_values[1].text = 14;
                        break;
                    case 'Services Pro':
                        element.column_values[1].text = 15;
                        break;
                    default:
                        break;
                }
                const queryStr = `INSERT INTO secteurs(secteur_name, category_id) values('${element.name}', ${element.column_values[1].text})`;

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
