import mysql from 'mysql2/promise';
import { Business } from '../models/business';

class ReqDatabaseRepository {
    static async getAllItems(): Promise<Business[]> {
      let itemsToReturn: Business[] = [];

      let connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'MuffinUnPeu$ec3',
        database: 'leads'
      });

      try {
        const [results, fields] = await connection.query(
          'SELECT * FROM leads.localisation'
        );

        let index: number = 0;
        while (index >= 0) {
          if (results[index]) {
            itemsToReturn.push(results[index]);
            index++;
          } else {
            index = -1;
          }
        }

      } catch (err) {
        console.log(err);
      }

      return itemsToReturn;
    }
  }
  
  export default ReqDatabaseRepository;