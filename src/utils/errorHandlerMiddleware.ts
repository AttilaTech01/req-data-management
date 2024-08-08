import { DatabaseError, MondayError } from './errorClass';
import Bugsnag  from '../BugSnag'
export const errorHandler = (err, req, res, next) => {
    //Send the error to the BugSnag
    const bugSnagMiddleware = Bugsnag.getPlugin("express")
    Bugsnag.notify(err)

    //Send to the clients the reponse
    if (err instanceof MondayError) {
        return res.status(400).json({ error: 'There was an error with Monday' });
    } else if (err instanceof DatabaseError) {
        
        return res.status(400).json({ error: 'There was an error with the Database' });
    }
    return res.status(500).json({ error: 'There was an unknown error' });
};

export default errorHandler;
