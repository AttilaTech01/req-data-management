import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import errorHandler from './utils/errorHandlerMiddleware';
import Bugsnag from './BugSnag';

dotenv.config({ path: './.env' });

const app = express();

const middleware = Bugsnag.getPlugin('express');
const port = process.env.PORT || 3000;
const key = process.env.MONDAY_ACCESS_TOKEN;
app.use(middleware.requestHandler);
app.use(express.json());
app.use(routes);
app.use(errorHandler);
app.use(middleware.errorHandler);
require('./utils/job');
app.listen(port, () =>
    console.log(`REQ Data management API is listening at http://localhost:${port}`)
);

export default app;
