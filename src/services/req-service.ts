import mondayRepository from '../repositories/monday-repository';
import reqRepository from '../repositories/req-database-repository';
import { Request } from 'express';
import mondayConfigService from './monday-config-service';
import { itemToBusiness } from '../models/getItemsResponse';
import { unverifiedLeadToBusiness } from '../models/getUnverifiedLeadsResponse';
import { unverifiedSecteurToSecteur } from '../models/getUnverifiedSecteursResponse';
import { MondayConfig } from '../models/mondayConfig';

class ReqService {
    static async getAllItems(req: Request): Promise<boolean> {
        try {
            const { category, mrc, limit, user } = req.query;

            // Getting monday config informations based on the user
            if (!user || typeof user !== 'string') {
                return false;
            }
            const userId = mondayConfigService.GetUserDatabaseID(user);

            // Creating the Query
            let queryStr = `SELECTT DISTINCT l.date_creation, l.email 'email' , l.id 'id_localisation', l.neq 'localisation_neq', l.secteur, l.adresse, l.ville, c.category_name 'category' , mrc.mrc_name, n.company_name FROM localisation l LEFT JOIN migration m ON l.id = m.localisation_id and m.user_id = ${userId} JOIN secteurs s on l.secteur = s.secteur_name JOIN category c on s.category_id = c.category_id JOIN ville v on l.ville = v.ville_name JOIN mrc on v.mrc_id = mrc.mrc_id JOIN name n on l.neq = n.neq WHERE m.localisation_id IS NULL and l.email is not null and l.email not in ('INVALID', 'VERIF');`;

            const userConfigInfos: MondayConfig = await mondayConfigService.GetUserConfig(
                user
            );

            if (category) {
                // Add a case to the category name to an id
                queryStr += ` and c.category_id = ${category}`;
            }
            if (mrc) {
                // Add a case to the category name to an id
                queryStr += ` and mrc.mrc_id = ${mrc}`;
            }

            queryStr += ` Limit ${limit || 50} `;

            queryStr += ';';

            // Sending the query
            const result = await reqRepository.getItems(queryStr);

            if (result.length === 0) {
                return true;
            }

            for (let index = 0; index < result.length; index++) {
                const element = itemToBusiness(result[index]);

                try {
                    await mondayRepository.createMondayItem(userConfigInfos, element);

                    // Updating the status of the DB item
                    const updateQuery = ` Insert into migration values(${userId}, ${element.id});`;

                    await reqRepository.customQueryDB(updateQuery);
                } catch (error) {
                    throw error;
                }
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    // LEADS
    // Get all the items with email=INVALID and a treshold less than 0.5 from the DB
    // Create each of them in monday board (6797870427)
    static async getUnVerifiedLeads(req: Request): Promise<any> {
        try {
            /* USER CHOICE DEACTIVATED
            const { user } = req.query;
            if (!user || typeof(user) !== "string") {
                return false;
            }
            */
            const userConfigInfos: MondayConfig = await mondayConfigService.GetUserConfig(
                'fyr'
            );

            let queryStr =
                "SELECT DISTINCT localisation.id, localisation.ville, localisation.email, localisation.neq, category.category_name, mrc.mrc_name, name.company_name FROM localisation JOIN secteurs ON localisation.secteur = secteurs.secteur_name JOIN category ON secteurs.category_id = category.category_id JOIN ville on localisation.ville = ville.ville_name JOIN mrc on ville.mrc_id = mrc.mrc_id Join name on localisation.neq = name.neq Where localisation.treshold < 0.5 and localisation.email = 'INVALID' and localisation.email != 'VERIF' LIMIT 10;";
            const result = await reqRepository.getUnVerifiedLeads(queryStr);

            // If there is no result return sucess
            if (result.length === 0) {
                return true;
            }

            //TODO - test with real db
            for (let index = 0; index < result.length; index++) {
                const element = unverifiedLeadToBusiness(result[index]);
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
            /* USER CHOICE DEACTIVATED
            const { user } = req.query;
            if (!user || typeof(user) !== "string") {
                return false;
            }
            */
            const userConfigInfos: MondayConfig = await mondayConfigService.GetUserConfig(
                'fyr'
            );

            const verifiedLeadsObject = await mondayRepository.getMondayVerifiedLeads(
                userConfigInfos.leads_verification.board_id,
                userConfigInfos.leads_verification.verification_status_column_id,
                [userConfigInfos.leads_verification.verified_status_value]
            );
            const verifiedLeads = verifiedLeadsObject.items;

            for (let index = 0; index < verifiedLeads.length; index++) {
                const element = verifiedLeads[index];
                const email = mondayConfigService.FindColumnValuefromId(
                    element,
                    userConfigInfos.leads_verification.email_column_id
                );
                const dbId = mondayConfigService.FindColumnValuefromId(
                    element,
                    userConfigInfos.leads_verification.db_id_column_id
                );

                const queryStr = `UPDATE localisation set email="${email}" where id = ${dbId}`;
                // Update the Database - temporarily DISABLED since we are using test data for the moment
                await reqRepository.customQueryDB(queryStr);
                // Update the monday status
                await mondayRepository.UpdateVerifiedLeadStatus(
                    userConfigInfos.leads_verification.board_id,
                    element.id,
                    userConfigInfos.leads_verification.verification_status_column_id,
                    userConfigInfos.leads_verification.db_updated_status_value
                );
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
                "SELECT DISTINCT localisation.secteur FROM localisation LEFT JOIN secteurs ON localisation.secteur = secteurs.secteur_name WHERE secteurs.secteur_name IS NULL AND localisation.secteur != '-' GROUP BY localisation.secteur LIMIT 50;";

            const result = await reqRepository.getUnVerifiedSecteurs(queryStr);

            if (result.length === 0) {
                return true;
            }

            for (let index = 0; index < result.length; index++) {
                const element = unverifiedSecteurToSecteur(result[index]);
                await mondayRepository.createUnVerifiedSecteur(element);
            }

            return result;
        } catch (error) {
            throw error;
        }
    }

    // Functions that Insert secteur to the DB and change the monday status
    static async createVerifiedSecteurs(): Promise<any> {
        try {
            const VerifObject = await mondayRepository.getMondayVerifiedSecteurs();
            const verifiedItems = VerifObject.items;

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
                await mondayRepository.UpdateVerifiedSecteurStatus(element.id);
            }

            return true;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default ReqService;
