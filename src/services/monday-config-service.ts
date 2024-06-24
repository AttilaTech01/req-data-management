import { MondayConfig } from '../models/mondayConfig';

class MondayConfigService {
    static async GetUserConfig(userName: string): Promise<MondayConfig> {
        try {
            return await import(`../../users_config/${userName.toLowerCase()}`);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static FindColumnValuefromId(mondayItem: any, columnId: string): string {
        const columns = mondayItem.column_values;

        for (let index = 0; index < columns.length; index++) {
            const column = columns[index];
            if (column.id === columnId) {
                return column.text;
            }
        }

        return 'N/D';
    }
}

export default MondayConfigService;