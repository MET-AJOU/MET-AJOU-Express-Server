import express from 'express';
import logger from 'morgan';
import router from './routes/index.js';
import cors from 'cors';

import { corsOption } from './Common/Constant/index.js';

const app = express();

app.use(cors(corsOption));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

export default app;