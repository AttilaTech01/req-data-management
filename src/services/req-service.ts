import mondayRepository from '../repositories/monday-repository'

class ReqService {
  static async createItems(sectorId: string, mrcId: string): Promise<boolean> {
    try {
      await mondayRepository.createItem(6235975840, ((Math.random() + 1).toString(36).substring(10)));
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default ReqService;
