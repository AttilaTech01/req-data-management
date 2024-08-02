import mysql from 'mysql2/promise';
import { Business, convertToBusiness } from '../models/business';

class ReqDatabaseRepository {
    static async customQueryDB(queryStr): Promise<Business[]> {
        let itemsToReturn: Business[] = [];

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
                    itemsToReturn.push(convertToBusiness(results[index]));
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
