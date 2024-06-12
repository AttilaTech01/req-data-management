import axios from 'axios';
import { query, response } from 'express';

class MondayRepository {

  // Get the object taht the services give ( database Object)
    static async createItem(item): Promise<boolean> {
// \\\"chiffres__1\\\":\\\"${item.telephone}\\\"
         
          
      await axios({
        url: 'https://api.monday.com/v2',
        method: 'post',
        headers: {
          Authorization: process.env.MONDAY_ACCES_TOKEN
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
      
  
      
      await axios({
        url: 'https://api.monday.com/v2',
        method: 'post',
        headers: {
        Authorization: process.env.MONDAY_ACCES_TOKEN

        },
        data: {
          query: `
            mutation {create_item (board_id: 6797870427, group_id: \"topics\", item_name: \"${item.Nom}\", column_values: \"{\\\"status\\\":\\\"À Vérifier\\\", \\\"chiffres__1\\\":\\\"${item.id}\\\" }\" ) {id}}
          `
        }
        
      }).then((result) => {
        console.log(result.data)
      }).catch((error) => {
        console.log(error);
      });

      
    
    
    return true;
    }

    static async createNotVerifiedSecteur(item): Promise<any> {
      
          
        
      
      await axios({
        url: 'https://api.monday.com/v2',
        method: 'post',
        headers: {
        Authorization: process.env.MONDAY_ACCES_TOKEN

        },
        data: {
          query: `
             mutation ($boardId: ID!) {create_item (board_id: $boardId, group_id: "new_group42707__1", item_name: "${item.secteur}") {id}}

          `,
          variables: {
            boardId: 6819942732
            
          }
          
        }
        
      }).then((result) => {
        console.log(result.data)
      }).catch((error) => {
        console.log(error);
      });

      
    
    
    return true;
    }





    static async getMondayVerifiedSecteur(): Promise<any> {
      try {
        const response = await axios({
          url: 'https://api.monday.com/v2',
          method: 'post',
          headers: {
            Authorization: process.env.MONDAY_ACCES_TOKEN
          },
          data: {
            query: "query { items_page_by_column_values (board_id: 6819942732, columns: [{column_id: \"statut4__1\", column_values: \"Vérifié\"}]) { cursor items { id name column_values {id text} }}}"
          }
        });
    
        console.log(response.data);
        return response.data; 
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
    

    static async UpdateVerifiedSecteurStatus(item): Promise<any> {
      
          
        
      
      await axios({
        url: 'https://api.monday.com/v2',
        method: 'post',
        headers: {
        Authorization: process.env.MONDAY_ACCES_TOKEN

        },
        data: {
          query: `
             mutation {change_multiple_column_values(item_id:${item.id}, board_id:6819942732, column_values: \"{\\\"statut4__1\\\" : {\\\"label\\\" : \\\"Fait\\\"}}\") {id}}
          `
          
        }
        
      }).then((result) => {
        console.log(result.data)
      }).catch((error) => {
        console.log(error);
      });

      
    
    
    return true;
    }



    static async UpdateVerifiedLeadsStatus(itemID): Promise<any> {
      
          
        
      
      await axios({
        url: 'https://api.monday.com/v2',
        method: 'post',
        headers: {
        Authorization: process.env.MONDAY_ACCES_TOKEN

        },
        data: {
          query: `
             mutation {change_multiple_column_values(item_id:${itemID}, board_id:6797870427, column_values: \"{\\\"status\\\" : {\\\"label\\\" : \\\"Fait\\\"}}\") {id}}
          `
          
        }
        
      }).then((result) => {
        console.log(result.data)
      }).catch((error) => {
        console.log(error);
      });

      
    
    
    return true;
    }

    static async getMondayVerifiedLeads(): Promise<any> {
      try {
        const response = await axios({
          url: 'https://api.monday.com/v2',
          method: 'post',
          headers: {
            Authorization: process.env.MONDAY_ACCES_TOKEN
          },
          data: {
            query: "query { items_page_by_column_values (board_id: 6797870427, columns: [{column_id: \"status\", column_values: \"Vérifié\"}]) { cursor items { id name column_values {id text} }}}"
          }
        });
    
        console.log(response.data);
        return response.data; 
      } catch (error) {
        console.log(error);
        throw error;
      }
    }




  } 
  
  export default MondayRepository;