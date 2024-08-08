import { DatabaseError, MondayError } from './errorClass';
export const errorHandler = (err, req, res, next) => {
    // send the call to Sentry
    if (err instanceof MondayError) {
        return res.status(400).json({ error: 'There was an error with Monday' });
    } else if (err instanceof DatabaseError) {
        return res.status(400).json({ error: 'There was an error with the Database' });
    }
    return res.status(500).json({ error: 'There was an unknown error' });
};

export default errorHandler;
