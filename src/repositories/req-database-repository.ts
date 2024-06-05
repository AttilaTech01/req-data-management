class ReqDatabaseRepository {
    static async getNewItems(sectorId: string, mrcId: string): Promise<boolean> {
      try {
        return true;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }
  
  export default ReqDatabaseRepository;