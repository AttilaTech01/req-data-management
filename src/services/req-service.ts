import { Request } from 'express';
import mondayRepository from '../repositories/monday-repository';
import reqRepository from '../repositories/req-database-repository';
import { categories } from '../models/categories';
import { UserError } from '../models/customErrors';
import { itemToBusiness } from '../models/getItemsResponse';
import { resultToItemList } from '../models/getItemsFromGroupResponse';
import { getItemsPageByColumnValuesResponse } from '../models/getItemsPageByColumnValuesResponse';
import { unverifiedLeadToBusiness } from '../models/getUnverifiedLeadsResponse';
import { MondayConfig } from '../models/mondayConfig';
import mondayConfigService from './monday-config-service';
import { MondayItem } from '../models/mondayItem';
import { Duplicate } from '../models/duplicate';

class ReqService {
    // LEADS
    static async getAllItems(req: Request): Promise<boolean> {
        try {
            const { category, mrc, limit, user } = req.query;

            // Getting monday config informations based on the user
            if (!user || typeof user !== 'string') {
                return false;
            }
            const userId = mondayConfigService.GetUserDatabaseID(user);

            // Creating the Query
            let queryStr = `SELECT DISTINCT l.date_creation, l.email 'email' , l.id 'id_localisation', l.neq 'localisation_neq', l.secteur, l.adresse, l.ville,  mrc.mrc_name, n.company_name FROM localisation l LEFT JOIN migration m ON l.id = m.localisation_id and m.user_id = ${userId} JOIN ville v on l.ville = v.ville_name JOIN mrc on v.mrc_id = mrc.mrc_id JOIN name n on l.neq = n.neq WHERE m.localisation_id IS NULL and l.email is not null and l.email not in ('INVALID', 'VERIF') and l.treshold > 0.49
`;

            const userConfigInfos: MondayConfig = await mondayConfigService.GetUserConfig(
                user
            );
            // Delete it for to remove category
            //if (category) {
            // Add a case to the category name to an id
            //// }

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

    static async updateLeadsCategorisation(req: Request): Promise<any> {
        try {
            const { user } = req.query;

            if (!user || typeof user !== 'string') {
                return false;
            }

            const userConfigInfos: MondayConfig = await mondayConfigService.GetUserConfig(
                user
            );
            // Get every leads where category status À faire
            const categorisedLeads = await mondayRepository.getCategorizedLeads(
                userConfigInfos
            );

            // Loop on the List of categorized leads
            for (let index = 0; index < categorisedLeads.items.length; index++) {
                const element = categorisedLeads.items[index];

                const leadsCategory = mondayConfigService.FindColumnValuefromId(
                    element,
                    userConfigInfos.new_entries.category_column_id
                );
                const leadsBdId = mondayConfigService.FindColumnValuefromId(
                    element,
                    userConfigInfos.new_entries.db_id_column_id
                );

                // Update the database
                const leadsCategoryId = categories[leadsCategory] || 0;
                const queryStr = `UPDATE localisation set category_id = ${leadsCategoryId} where id = ${leadsBdId} `;
                await reqRepository.customQueryDB(queryStr);

                // Update monday status
                await mondayRepository.updateMondayStatus(
                    userConfigInfos.new_entries.board_id,
                    element.id,
                    userConfigInfos.new_entries.category_status,
                    userConfigInfos.new_entries.categorized_status_value
                );
            }

            return true;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async duplicatesVerification(req: Request): Promise<Duplicate[]> {
        try {
            const { user } = req.query;
            if (!user || typeof user !== 'string') {
                throw new UserError('User must be specified');
            }
            const userConfigInfos: MondayConfig = await mondayConfigService.GetUserConfig(
                user
            );

            const itemsToVerify: MondayItem[] = resultToItemList(
                await mondayRepository.getItemsFromGroup(
                    userConfigInfos.new_entries.board_id,
                    userConfigInfos.new_entries.duplicates_group_id
                )
            );
            const boardsToVerify =
                userConfigInfos.new_entries.duplicates_boards_to_check_id;
            let itemsWithDuplicates: Duplicate[] = [];

            // For each item, find the email value and verify that no duplicate exist in given list of boards
            for (let item of itemsToVerify) {
                let hasDuplicate: boolean = false;
                const emailValue: string = mondayConfigService
                    .FindColumnValuefromId(
                        item,
                        userConfigInfos.new_entries.email_column_id
                    )
                    .toString();

                for (let boardId of boardsToVerify) {
                    const foundDuplicates: getItemsPageByColumnValuesResponse =
                        await mondayRepository.getItemsByColumnValues(
                            boardId,
                            userConfigInfos.new_entries.email_column_id,
                            [emailValue]
                        );

                    const isDuplicate: number =
                        boardId === userConfigInfos.new_entries.board_id ? 1 : 0;

                    if (foundDuplicates.items.length > isDuplicate) {
                        // If a duplicate is found, update status to NOT OK
                        await mondayRepository.updateMondayStatus(
                            userConfigInfos.new_entries.board_id,
                            item.id,
                            userConfigInfos.new_entries.duplicates_status_column_id,
                            userConfigInfos.new_entries.duplicates_not_ok_status_value
                        );
                        // Item is gonna be sent to user
                        itemsWithDuplicates.push({
                            id: item.id,
                            name: item.name,
                            boardId: boardId,
                        });
                        hasDuplicate = true;
                        break;
                    }
                }

                if (!hasDuplicate) {
                    // If no duplicate is found, update status to OK
                    await mondayRepository.updateMondayStatus(
                        userConfigInfos.new_entries.board_id,
                        item.id,
                        userConfigInfos.new_entries.duplicates_status_column_id,
                        userConfigInfos.new_entries.duplicates_ok_status_value
                    );
                }
            }

            return itemsWithDuplicates;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // VERIFICATION
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
                const telephone = mondayConfigService.FindColumnValuefromId(
                    element,
                    userConfigInfos.leads_verification.telephone_column_id
                );
                const dbId = mondayConfigService.FindColumnValuefromId(
                    element,
                    userConfigInfos.leads_verification.db_id_column_id
                );

                const queryStr = `UPDATE localisation set email="${email}", telephone = "${telephone}" where id = ${dbId}`;
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

    // BD MIGRATION DONE
    /*
    static async nameTransfer(): Promise<any> {
        try {
            const queryStr =
                'select DISTINCT l.id, l.company_name "localisation_name", l.company_migration, n.company_name, l.neq from localisation l join name n on l.neq = n.neq where l.company_migration != 1 limit 50;';
            const listToMerge = await reqRepository.getMergeNameItems(queryStr);
            console.log(listToMerge);

            for (let index = 0; index < listToMerge.length; index++) {
                const element = listToMerge[index];
                //console.log(element);
                const updateQueryStr = `Update localisation set company_name = "${element.company_name}", company_migration = 1 where id = ${element.id}`;
                console.log(updateQueryStr);
                await reqRepository.customQueryDB(updateQueryStr);
            }
            return true;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    */
}

export default ReqService;
