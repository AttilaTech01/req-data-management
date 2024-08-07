import mysql from 'mysql2/promise';
import { GetItemsResponse } from '../models/getItemsResponse';
import { GetUnverifiedLeadsResponse } from '../models/getUnverifiedLeadsResponse';
import { GetUnverifiedSecteursResponse } from '../models/getUnverifiedSecteursResponse';

class ReqDatabaseRepository {
    static async customQueryDB(queryStr): Promise<void> {
        try {
            let connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'leads',
            });
        
            await connection.query(queryStr); 
            
            connection.end();
        } catch (err) {
            throw err;
        }
    }

    static async getItems(queryStr): Promise<GetItemsResponse[]> {
        let itemsToReturn: GetItemsResponse[] = [];

        try {
            let connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'leads',
            });
        
            const [results, fields] = await connection.query(queryStr); 

            let index: number = 0;
            while (index >= 0) {
                if (results[index]) {
                    itemsToReturn.push(results[index]);
                    index++;
                } else {
                    index = -1;
                }
            }
            
            connection.end();
        } catch (err) {
            throw err;
        }
        return itemsToReturn;
    }

    static async getUnVerifiedLeads(queryStr): Promise<GetUnverifiedLeadsResponse[]> {
        let itemsToReturn: GetUnverifiedLeadsResponse[] = [];

        try {
            let connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'leads',
            });
        
            const [results, fields] = await connection.query(queryStr); 

            let index: number = 0;
            while (index >= 0) {
                if (results[index]) {
                    itemsToReturn.push(results[index]);
                    index++;
                } else {
                    index = -1;
                }
            }
            
            connection.end();
        } catch (err) {
            throw err;
        }
        return itemsToReturn;
    }

    static async getUnVerifiedSecteurs(queryStr): Promise<GetUnverifiedSecteursResponse[]> {
        let itemsToReturn: GetUnverifiedSecteursResponse[] = [];

        try {
            let connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'leads',
            });
        
            const [results, fields] = await connection.query(queryStr); 

            let index: number = 0;
            while (index >= 0) {
                if (results[index]) {
                    itemsToReturn.push(results[index]);
                    index++;
                } else {
                    index = -1;
                }
            }
            
            connection.end();
        } catch (err) {
            throw err;
        }
        return itemsToReturn;
    }
}

export default ReqDatabaseRepository;
