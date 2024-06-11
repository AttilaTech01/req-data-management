import axios from 'axios';
import { query } from 'express';

class MondayRepository {

  // Get the object taht the services give ( database Object)
    static async createItem(item): Promise<boolean> {
// \\\"chiffres__1\\\":\\\"${item.telephone}\\\"
         
          
      await axios({
        url: 'https://api.monday.com/v2',
        method: 'post',
        headers: {
          Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjM2OTY3NDMzOSwiYWFpIjoxMSwidWlkIjo0MjcyNjAyMiwiaWFkIjoiMjAyNC0wNi0wOFQxODowODoxMi40NTZaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTEwMDIyMzEsInJnbiI6InVzZTEifQ.PY5ZV4uTWp4jWgu5b8GDMtapBJiTDMhhLywhtht_Jx8"
        },
        data: {
          query:
          ` mutation {create_item (board_id: 6803849261, group_id: \"new_group42707__1\", item_name: \"${item.Nom}\", column_values: \"{\\\"statut__1\\\":\\\"${item.Category}\\\", \\\"email\\\":\\\"${item.email + " "+ item.email }\\\", \\\"statut6__1\\\":\\\"${item.nom}\\\", \\\"texte2__1\\\":\\\"${item.ville}\\\", \\\"texte6__1\\\":\\\"${item.secteur}\\\"  }\") {id}} `  
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
        Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjM2OTY3NDMzOSwiYWFpIjoxMSwidWlkIjo0MjcyNjAyMiwiaWFkIjoiMjAyNC0wNi0wOFQxODowODoxMi40NTZaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTEwMDIyMzEsInJnbiI6InVzZTEifQ.PY5ZV4uTWp4jWgu5b8GDMtapBJiTDMhhLywhtht_Jx8"

        },
        data: {
          query: `
            mutation {create_item (board_id: 6797870427, group_id: \"topics\", item_name: \"${element.Nom}\", column_values: \"{\\\"status\\\":\\\"À Vérifier\\\", \\\"texte3__1\\\":\\\""bturcote@gmail.com" "bturcote@gmail.com"\\\", \\\"texte__1\\\":\\\"Test\\\", \\\"chiffres__1\\\":\\\"${element.id}\\\", \\\"chiffres7__1\\\":\\\"${element.telephone || 0}\\\" }\" ) {id}}
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