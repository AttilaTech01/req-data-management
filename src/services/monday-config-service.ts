import { MondayConfig } from '../models/mondayConfig';

// Users with their Database ID
// Update when adding new user
enum User {
    fyr = 1,
    galilee = 2,
}

class MondayConfigService {
    static async GetUserConfig(userName: string): Promise<MondayConfig> {
        try {
            return await import(`../../users_config/${userName.toLowerCase()}`);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static GetUserDatabaseID(userName: string): number {
        return User[userName.toLowerCase() as keyof typeof User];
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