interface CustomError extends Error {
    statusCode: number;
    extraInfo: {};
}

class MondayError extends Error implements CustomError {
    statusCode: number;
    extraInfo: {};
    constructor(message, statusCode, extraInfo: {} = {}) {
        super(message);
        this.name = 'MondayError';
        this.statusCode = statusCode;
        this.message = message;
        this.extraInfo = extraInfo;
    }
}

class DatabaseError extends Error implements CustomError {
    statusCode: number;
    extraInfo: {};
    constructor(message, extraInfo: {} = {}) {
        super(message);
        this.name = 'SQlError';
        this.statusCode = 400;
        this.message = message;
        this.extraInfo = extraInfo;
    }
}

class UserError extends Error implements CustomError {
    statusCode: number;
    extraInfo: {};
    constructor(message, extraInfo: {} = {}) {
        super(message);
        this.name = 'UserError';
        this.statusCode = 400;
        this.message = message;
        this.extraInfo = extraInfo;
    }
}

export { MondayError, DatabaseError, UserError };
