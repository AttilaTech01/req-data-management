import axios from 'axios';
import { isMondayErrorResponse, throwMondayError } from '../utils/mondayErrorHandler';
import { Business } from '../models/business';
import { getItemsPageByColumnValuesResponse } from '../models/getItemsPageByColumnValuesResponse';
import { MondayConfig } from '../models/mondayConfig';
import { Secteur } from '../models/secteur';

class MondayRepository {
    // Returns database Object
    static async createMondayItem(
        userConfigInfos: MondayConfig,
        item: Business
    ): Promise<boolean> {
        const configs = userConfigInfos.new_entries;
        try {
            const response = await axios({
                url: 'https://api.monday.com/v2',
                method: 'post',
                headers: {
                    Authorization: process.env.MONDAY_ACCESS_TOKEN,
                },
                data: {
                    query: ` mutation {create_item (board_id: ${
                        configs.board_id
                    }, group_id: \"${configs.group_id}\", item_name: \"${
                        item.name
                    }\", column_values: \"{ \\\"${configs.email_column_id}\\\":\\\"${
                        item.email + ' ' + item.email
                    }\\\", \\\"${configs.region_column_id}\\\":\\\"${item.mrc}\\\", \\\"${
                        configs.db_id_column_id
                    }\\\":\\\"${item.id}\\\", \\\"${configs.city_column_id}\\\":\\\"${
                        item.ville
                    }\\\", \\\"${configs.secteur_column_id}\\\":\\\"${
                        item.secteur
                    }\\\", \\\"${configs.foundation_date_column_id}\\\":\\\"${
                        item.date_creation
                    }\\\"  }\") {id}} `,
                },
            });

            if (isMondayErrorResponse(response.data)) {
                throw response.data;
            }

            return true;
        } catch (error) {
            throw throwMondayError(error);
        }
    }

    // LEADS
    static async createUnVerifiedLead(
        boardId: number,
        groupId: string,
        item: Business,
        verifiedColumnId: string,
        verifiedColumnValue: string,
        dbIdColumnId: string
    ): Promise<boolean> {
        try {
            const response = await axios({
                url: 'https://api.monday.com/v2',
                method: 'post',
                headers: {
                    Authorization: process.env.MONDAY_ACCESS_TOKEN,
                },
                data: {
                    query: `
                mutation {create_item (board_id: ${boardId}, group_id: \"${groupId}\", item_name: \"${item.name}\", column_values: \"{\\\"${verifiedColumnId}\\\":\\\"${verifiedColumnValue}\\\", \\\"${dbIdColumnId}\\\":\\\"${item.id}\\\" }\" ) {id}}
              `,
                },
            });

            if (isMondayErrorResponse(response.data)) {
                throw response.data;
            }

            return true;
        } catch (error) {
            throw throwMondayError(error);
        }
    }

    static async getMondayVerifiedLeads(
        boardId: number,
        columnId: string,
        columnValue: string[]
    ): Promise<getItemsPageByColumnValuesResponse> {
        try {
            const response = await axios({
                url: 'https://api.monday.com/v2',
                method: 'post',
                headers: {
                    Authorization: process.env.MONDAY_ACCESS_TOKEN,
                },
                data: {
                    query: 'query ($boardId: ID!, $columnId: String!, $columnValue: [String]!) { items_page_by_column_values (board_id: $boardId, columns: [{column_id: $columnId, column_values: $columnValue}]) { cursor items { id name column_values {id text} }}}',
                    variables: {
                        boardId,
                        columnId,
                        columnValue,
                    },
                },
            });

            if (isMondayErrorResponse(response.data)) {
                throw response.data;
            }

            return response.data.data.items_page_by_column_values;
        } catch (error) {
            throw throwMondayError(error);
        }
    }

    static async UpdateVerifiedLeadStatus(
        boardId: number,
        itemId: number,
        columnId: string,
        columnValue: string
    ): Promise<boolean> {
        try {
            const response = await axios({
                url: 'https://api.monday.com/v2',
                method: 'post',
                headers: {
                    Authorization: process.env.MONDAY_ACCESS_TOKEN,
                },
                data: {
                    query: `mutation {change_multiple_column_values(item_id: ${itemId}, board_id: ${boardId}, column_values: \"{\\\"${columnId}\\\" : {\\\"label\\\" : \\\"${columnValue}\\\"}}\") {id}}`,
                },
            });

            if (isMondayErrorResponse(response.data)) {
                throw response.data;
            }

            return true;
        } catch (error) {
            throw throwMondayError(error);
        }
    }

    // SECTEURS
    static async createUnVerifiedSecteur(item: Secteur): Promise<boolean> {
        try {
            const response = await axios({
                url: 'https://api.monday.com/v2',
                method: 'post',
                headers: {
                    Authorization: process.env.MONDAY_ACCESS_TOKEN,
                },
                data: {
                    query: `
                 mutation ($boardId: Int!) {create_item (board_id: $boardId, group_id: "new_group42707__1", item_name: "${item.name}") {id}}
              `,
                    variables: {
                        boardId: 6819942732,
                    },
                },
            });

            if (isMondayErrorResponse(response.data)) {
                throw response.data;
            }

            return true;
        } catch (error) {
            throw throwMondayError(error);
        }
    }

    static async getMondayVerifiedSecteurs(): Promise<getItemsPageByColumnValuesResponse> {
        try {
            const response = await axios({
                url: 'https://api.monday.com/v2',
                method: 'post',
                headers: {
                    Authorization: process.env.MONDAY_ACCESS_TOKEN,
                },
                data: {
                    query: 'query { items_page_by_column_values (board_id: 6819942732, columns: [{column_id: "statut4__1", column_values: "Vérifié"}]) { cursor items { id name column_values {id text} }}}',
                },
            });

            if (isMondayErrorResponse(response.data)) {
                throw response.data;
            }

            return response.data.data.items_page_by_column_values;
        } catch (error) {
            throw throwMondayError(error);
        }
    }

    static async UpdateVerifiedSecteurStatus(itemId: number): Promise<boolean> {
        try {
            const response = await axios({
                url: 'https://api.monday.com/v2',
                method: 'post',
                headers: {
                    Authorization: process.env.MONDAY_ACCESS_TOKEN,
                },
                data: {
                    query: `
                 mutation {change_multiple_column_values(item_id:${itemId}, board_id:6819942732, column_values: \"{\\\"statut4__1\\\" : {\\\"label\\\" : \\\"DB Updaté\\\"}}\") {id}}
              `,
                },
            });

            if (isMondayErrorResponse(response.data)) {
                throw response.data;
            }

            return true;
        } catch (error) {
            throw throwMondayError(error);
        }
    }

    /* UNUSED
    static async ItemCreation(item): Promise<any> {
        await axios({
            url: 'https://api.monday.com/v2',
            method: 'post',
            headers: {
                Authorization: process.env.MONDAY_ACCESS_TOKEN,
            },
            data: {
                query: `
             mutation {change_multiple_column_values(item_id:${item.id}, ${item.board_id}, column_values: \"{\\\"statut4__1\\\" : {\\\"label\\\" : \\\"DB Updaté\\\"}}\") {id}}
          `,
            },
        })
        .then((result) => {
            console.log(result.data);
        })
        .catch((error) => {
            console.log(error);
        });

        return true;
    }
    */

    static async getCategorisedLeads(): Promise<any> {
        try {
            const response = await axios({
                url: 'https://api.monday.com/v2',
                method: 'post',
                headers: {
                    Authorization: process.env.MONDAY_ACCESS_TOKEN,
                },
                data: {
                    query: 'query { items_page_by_column_values (board_id: 6803849261, columns: [{column_id: "statut5__1", column_values: "À faire"}]) { cursor items { id name column_values {id text}}}}',
                },
            });

            if (isMondayErrorResponse(response.data)) {
                throw response.data;
            }

            return response.data.data.items_page_by_column_values;
        } catch (error) {
            throw throwMondayError(error);
        }
    }
    static async updateCategorisedLeadStatus(
        boardId: number,
        itemId: number,
        columnId: string,
        columnValue: string
    ): Promise<boolean> {
        try {
            const response = await axios({
                url: 'https://api.monday.com/v2',
                method: 'post',
                headers: {
                    Authorization: process.env.MONDAY_ACCESS_TOKEN,
                },
                data: {
                    query: `mutation {change_multiple_column_values(item_id: ${itemId}, board_id: ${boardId}, column_values: \"{\\\"${columnId}\\\" : {\\\"label\\\" : \\\"${columnValue}\\\"}}\") {id}}`,
                },
            });

            if (isMondayErrorResponse(response.data)) {
                throw response.data;
            }

            return true;
        } catch (error) {
            throw throwMondayError(error);
        }
    }
}

export default MondayRepository;
