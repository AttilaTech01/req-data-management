interface customError extends Error {
    statusCode: number;
}

class MondayError extends Error implements customError {
    statusCode: number;
    constructor(message, statusCode) {
        super(message);
        this.name = 'MondayError';
        this.statusCode = statusCode;
        this.message = message;
    }
}

class DatabaseError extends Error implements customError {
    statusCode: number;
    constructor(message) {
        super(message);
        this.name = 'SQlError';
        this.statusCode = 400;
        this.message = message;
    }
}

export { MondayError, DatabaseError };
