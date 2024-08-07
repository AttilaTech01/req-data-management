// There is 3 types of monday errors
// This handler was inspired by: https://developer.monday.com/api-reference/docs/errors

export function isMondayErrorResponse(data: any): boolean {
    if (data.hasOwnProperty('error_message') || data.hasOwnProperty('error_code') || data.hasOwnProperty('errors')) {
        return true;
    }
    return false;
}

export function getMondayErrorMessage(data: any): string {
    switch(true) {
        case data.hasOwnProperty('errors'): {
            return data.errors[0].message;
        }
        case data.hasOwnProperty('error_message'): {
            return data.error_message;
        }
        case data.hasOwnProperty('error_code'): {
            return data.error_message;
        }
        default: {
            return 'Unkown error'
        }
    }
}