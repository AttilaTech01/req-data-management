import mondayRepository from '../repositories/monday-repository'
import reqRepository from '../repositories/req-database-repository';
import { Business } from '../models/business';

class ReqService {
  static async createItems(sectorId: string, mrcId: string): Promise<boolean> {
    try {
      const newItems: Business[] = await reqRepository.getAllItems();

      for (let i = 0; i < newItems.length; i++) {
        const itemName: string = newItems[i].id.toString() + ' ' + newItems[i].secteur;
        await mondayRepository.createItem(6235975840, itemName);
      }
      
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getAllItems(): Promise<boolean> {
    try {
      await reqRepository.getAllItems();
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default ReqService;
