class MondayRepository {
    static async createItem(boardId: number): Promise<boolean> {
      try {
        return true;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }
  
  export default MondayRepository;