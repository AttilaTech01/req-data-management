// There is 3 types of monday errors
// This handler was inspired by: https://developer.monday.com/api-reference/docs/errors
import { MondayError } from './errorClass';

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

export function throwMondayError(data: any): MondayError {
    switch (true) {
        case data.hasOwnProperty('error_code'): {
            return new MondayError(data.error_message, 403);
        }
        case data.hasOwnProperty('error_message'): {
            return new MondayError(data.error_message, 500);
        }
        case data.hasOwnProperty('errors'): {
            return new MondayError(data.errors[0].message, 500);
        }
        default: {
            return new MondayError('New Monday Error', 500);
        }
    }
}
