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

export function findMondayErrorCode(data: any): number {
    switch (true) {
        case data.hasOwnProperty('error_code'): {
            return 403;
        }
        case data.hasOwnProperty('error_message'): {
            return 500;
        }
        case data.hasOwnProperty('errors'): {
            return 500;
        }
        default: {
            return 500;
        }
    }
}
