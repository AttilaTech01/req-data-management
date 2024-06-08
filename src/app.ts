import express from 'express';
import dotenv from 'dotenv';

import routes from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000 ;

app.use(express.json());
app.use(routes);

app.listen(port, () => console.log(`REQ Data management API is listening at http://localhost:${port}`));

export default app;
