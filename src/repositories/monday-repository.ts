import axios from 'axios';
import { isMondayErrorResponse, findMondayErrorCode } from '../utils/mondayErrorHandler';
import { Business } from '../models/business';
import { getItemsPageByColumnValuesResponse } from '../models/getItemsPageByColumnValuesResponse';
import { getItemsFromGroupResponse } from '../models/getItemsFromGroupResponse';
import { MondayConfig } from '../models/mondayConfig';
import { MondayError } from '../models/customErrors';
class MondayRepository {
    // LEADS
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
                    }\", column_value: \"{ \\\"${configs.email_column_id}\\\":\\\"${
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
            const { message, statusCode } = findMondayErrorCode(error);
            throw new MondayError(message, statusCode, {
                itemID: item.id,
            });
        }
    }

    static async getCategorizedLeads(
        userConfigInfos: MondayConfig
    ): Promise<getItemsPageByColumnValuesResponse> {
        const configs = userConfigInfos.new_entries;
        try {
            const response = await axios({
                url: 'https://api.monday.com/v2',
                method: 'post',
                headers: {
                    Authorization: process.env.MONDAY_ACCESS_TOKEN,
                },
                data: {
                    query: ` query { items_page_by_column_values (board_id: ${configs.board_id}, columns: [{column_id: "${configs.category_status}", column_values: "${configs.to_categorized_status_value}"}]) { cursor items { id name column_values {id text}}}}`,
                },
            });

            if (isMondayErrorResponse(response.data)) {
                throw response.data;
            }

            return response.data.data.items_page_by_column_values;
        } catch (error) {
            const { message, statusCode } = findMondayErrorCode(error);
            throw new MondayError(message, statusCode);
        }
    }

    static async updateMondayStatus(
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
            const { message, statusCode } = findMondayErrorCode(error);
            throw new MondayError(message, statusCode);
        }
    }

    static async getItemsFromGroup(
        boardId: number,
        groupId: string
    ): Promise<getItemsFromGroupResponse> {
        try {
            const response = await axios({
                url: 'https://api.monday.com/v2',
                method: 'post',
                headers: {
                    Authorization: process.env.MONDAY_ACCESS_TOKEN,
                },
                data: {
                    query: `query { boards (ids: ${boardId}) { groups (ids: [\"${groupId}\"]) { title id items_page { items { id name column_values { id text }}}}}}`,
                },
            });

            if (isMondayErrorResponse(response.data)) {
                throw response.data;
            }

            return response.data.data;
        } catch (error) {
            const { message, statusCode } = findMondayErrorCode(error);
            throw new MondayError(message, statusCode);
        }
    }

    static async getItemsByColumnValues(
        boardId: number,
        columnId: string,
        columnValues: string[]
    ): Promise<getItemsPageByColumnValuesResponse> {
        try {
            const response = await axios({
                url: 'https://api.monday.com/v2',
                method: 'post',
                headers: {
                    Authorization: process.env.MONDAY_ACCESS_TOKEN,
                },
                data: {
                    query: `query { items_page_by_column_values (board_id: ${boardId}, columns: [{column_id: \"${columnId}\", column_values: \"${columnValues}\"}]) { cursor items { id name column_values {id text} }}}`,
                },
            });

            if (isMondayErrorResponse(response.data)) {
                throw response.data;
            }

            return response.data.data.items_page_by_column_values;
        } catch (error) {
            const { message, statusCode } = findMondayErrorCode(error);
            throw new MondayError(message, statusCode);
        }
    }

    // VERIFICATION
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
            const { message, statusCode } = findMondayErrorCode(error);
            throw new MondayError(message, statusCode, {
                itemID: item.id,
            });
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
            const { message, statusCode } = findMondayErrorCode(error);
            throw new MondayError(message, statusCode);
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
            const { message, statusCode } = findMondayErrorCode(error);
            throw new MondayError(message, statusCode, {
                itemID: itemId,
            });
        }
    }
}

export default MondayRepository;
