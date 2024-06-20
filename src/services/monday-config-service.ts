import { MondayConfig } from '../models/mondayConfig';

class MondayConfigService {
    static async GetUserConfig(userName: string): Promise<MondayConfig> {
        return await import(`../../users_config/${userName.toLowerCase()}`);
    }
}

export default MondayConfigService;