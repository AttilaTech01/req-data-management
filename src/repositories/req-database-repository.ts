import mysql from 'mysql2/promise';
import { Business } from '../models/business';
import querystring from "querystring"
import { query } from 'express';

class ReqDatabaseRepository {
    static async customQueryDB(queryStr): Promise<any> {
      let itemsToReturn: Business[] = [];

      let connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'leads'
      });

      try {
        const [results, fields] = await connection.query(
          queryStr
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