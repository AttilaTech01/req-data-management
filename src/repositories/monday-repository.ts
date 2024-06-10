import axios from 'axios';

class MondayRepository {

  // Get the object taht the services give ( database Object)
    static async createItem(item): Promise<boolean> {
      await axios({
        url: 'https://api.monday.com/v2',
        method: 'post',
        headers: {
          Authorization: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
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
            //boardId: item.nom,
            itemName: item.nom
          }
        }
      }).then((result) => {
        console.log(result.data)
      }).catch((error) => {
        console.log(error);
      });

      return true;
    }


    static async createVerifItems(item): Promise<any> {
      for (let index = 0; index < item.length; index++) {
          
        const element = item[index]
      
      await axios({
        url: 'https://api.monday.com/v2',
        method: 'post',
        headers: {
        Authorization: "XXXXXXXXXXXXXXXXXXXX"

        },
        data: {
          query: `
            mutation {create_item (board_id: 6797870427, group_id: \"topics\", item_name: \"${element.Nom}\", column_values: \"{\\\"status\\\":\\\"À Vérifier\\\", \\\"texte3__1\\\":\\\"${element.email  || "No Email"}\\\", \\\"texte__1\\\":\\\"Test\\\", \\\"chiffres__1\\\":\\\"${element.id}\\\", \\\"chiffres7__1\\\":\\\"${element.telephone || 0}\\\" }\" ) {id}}
          `
        }
      }).then((result) => {
        console.log(result.data)
      }).catch((error) => {
        console.log(error);
      });

      
    }
    return true;
    }
  }
  
  export default MondayRepository;