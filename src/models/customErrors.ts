interface CustomError extends Error {
    statusCode: number;
}

class MondayError extends Error implements CustomError {
    statusCode: number;
    constructor(message, statusCode) {
        super(message);
        this.name = 'MondayError';
        this.statusCode = statusCode;
        this.message = message;
    }
}

class DatabaseError extends Error implements CustomError {
    statusCode: number;
    constructor(message) {
        super(message);
        this.name = 'SQlError';
        this.statusCode = 400;
        this.message = message;
    }
}

class UserError extends Error implements CustomError {
    statusCode: number;
    constructor(message) {
        super(message);
        this.name = 'UserError';
        this.statusCode = 400;
        this.message = message;
    }
}

export { MondayError, DatabaseError, UserError };
