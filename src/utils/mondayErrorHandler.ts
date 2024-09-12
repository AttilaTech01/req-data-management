// There is 3 types of monday errors
// This handler was inspired by: https://developer.monday.com/api-reference/docs/errors
import { MondayError } from '../models/customErrors';

export function isMondayErrorResponse(data: any): boolean {
    if (
        data.hasOwnProperty('error_message') ||
        data.hasOwnProperty('error_code') ||
        data.hasOwnProperty('errors')
    ) {
        return true;
    }
    return false;
}

export function findMondayErrorCode(data: any): any {
    switch (true) {
        case data.hasOwnProperty('error_code'): {
            //return new MondayError(data.error_message, 403);
            const message = data.error_message;
            const statusCode = 403;
            return { message, statusCode };
        }
        case data.hasOwnProperty('error_message'): {
            //return new MondayError(data.error_message, 500);
            const message = data.error_message;
            const statusCode = 500;
            return { message, statusCode };
        }
        case data.hasOwnProperty('errors'): {
            //return new MondayError(data.errors[0].message, 500)
            const message = data.errors[0].message;
            const statusCode = 500;
            return { message, statusCode };
        }
        default: {
            //return new MondayError('New Monday Error', 500)
            const message = 'New Monday Error';
            const statusCode = 500;
            return { message, statusCode };
        }
    }
}
