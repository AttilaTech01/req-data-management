interface MondayErrorResponse {
    error_message: string;
    error_code: string;
    error_data: {
        column_value: string;
        column_type: string;
    };
    status_code: number;
    account_id: number;
}

export function isMondayErrorResponse(data: any): data is MondayErrorResponse {
    return 'error_message' && 'error_code' in data;
}