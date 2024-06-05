import axios from 'axios';

class MondayRepository {
    static async createItem(boardId: number, itemName: string): Promise<boolean> {
      await axios({
        url: 'https://api.monday.com/v2',
        method: 'post',
        headers: {
          Authorization: process.env.MONDAY_ACCESS_TOKEN
        },
        data: {
          query: `
            mutation ($boardId: ID!, $itemName: String!) {
              create_item(board_id: $boardId, group_id: "new_group__1", item_name: $itemName) {
                id
              }
            }
          `,
          variables: {
            boardId: boardId,
            itemName: itemName
          }
        }
      }).then((result) => {
        console.log(result.data)
      }).catch((error) => {
        console.log(error);
      });

      return true;
    }
  }
  
  export default MondayRepository;