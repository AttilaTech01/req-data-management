import axios from 'axios';
import { MondayConfig } from '../models/mondayConfig';

class MondayRepository {
    // Returns database Object
    static async createMondayItem(userConfigInfos: MondayConfig, item: any): Promise<boolean> {
        // \\\"chiffres__1\\\":\\\"${item.telephone}\\\"
        const configs = userConfigInfos.new_entries;
        try {
            const response = await axios({
                url: 'https://api.monday.com/v2',
                method: 'post',
                headers: {
                    Authorization: process.env.MONDAY_ACCESS_TOKEN,
                },
                data: {
                    query: ` mutation {create_item (board_id: ${configs.board_id}, group_id: \"${configs.group_id}\", item_name: \"${
                        item.Nom
                    }\", column_values: \"{\\\"${configs.category_column_id}\\\":\\\"${
                        item.Category
                    }\\\", \\\"${configs.email_column_id}\\\":\\\"${
                        item.email + ' ' + item.email
                    }\\\", \\\"${configs.region_column_id}\\\":\\\"${
                        item.nom
                    }\\\", \\\"${configs.city_column_id}\\\":\\\"${
                        item.ville
                    }\\\", \\\"${configs.secteur_column_id}\\\":\\\"${
                        item.secteur
                    }\\\"  }\") {id}} `,
                },
            });

            return true;
        } catch (error) {
            throw new Error(`MondayRepository Error: ${error.message}`);
        }
    }

    // LEADS
    static async createUnVerifiedLead(boardId: number, groupId: string, item: any, verifiedColumnId: string, verifiedColumnValue: string, dbIdColumnId: string): Promise<boolean> {
        await axios({
            url: 'https://api.monday.com/v2',
            method: 'post',
            headers: {
                Authorization: process.env.MONDAY_ACCESS_TOKEN,
            },
            data: {
                query: `
            mutation {create_item (board_id: ${boardId}, group_id: \"${groupId}\", item_name: \"${item.Nom}\", column_values: \"{\\\"${verifiedColumnId}\\\":\\\"${verifiedColumnValue}\\\", \\\"${dbIdColumnId}\\\":\\\"${item.id}\\\" }\" ) {id}}
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

    static async getMondayVerifiedLeads(boardId: number, columnId: string, columnValue: string[]): Promise<any> {
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
                        columnValue
                    }
                }
            });

            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async UpdateVerifiedLeadStatus(boardId: number, itemId: number, columnId: string, columnValue: string): Promise<any> {
        await axios({
            url: 'https://api.monday.com/v2',
            method: 'post',
            headers: {
                Authorization: process.env.MONDAY_ACCESS_TOKEN,
            },
            data: {
                query: `mutation {change_multiple_column_values(item_id: ${itemId}, board_id: ${boardId}, column_values: \"{\\\"${columnId}\\\" : {\\\"label\\\" : \\\"${columnValue}\\\"}}\") {id}}`,
            },
        })
            .then((result) => {
                console.log('ITS A result');

                console.log(result.data);
            })
            .catch((error) => {
                console.log('ITS AN ERROR');
                console.log(error);
            });

        return true;
    }

    // SECTEURS
    static async createUnVerifiedSecteur(item): Promise<any> {
        await axios({
            url: 'https://api.monday.com/v2',
            method: 'post',
            headers: {
                Authorization: process.env.MONDAY_ACCESS_TOKEN,
            },
            data: {
                query: `
             mutation ($boardId: ID!) {create_item (board_id: $boardId, group_id: "new_group42707__1", item_name: "${item.secteur}") {id}}
          `,
                variables: {
                    boardId: 6819942732,
                },
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

    static async getMondayVerifiedSecteurs(): Promise<any> {
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

            console.log(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async UpdateVerifiedSecteurStatus(item): Promise<any> {
        await axios({
            url: 'https://api.monday.com/v2',
            method: 'post',
            headers: {
                Authorization: process.env.MONDAY_ACCESS_TOKEN,
            },
            data: {
                query: `
             mutation {change_multiple_column_values(item_id:${item.id}, board_id:6819942732, column_values: \"{\\\"statut4__1\\\" : {\\\"label\\\" : \\\"DB Updaté\\\"}}\") {id}}
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
}

export default MondayRepository;
