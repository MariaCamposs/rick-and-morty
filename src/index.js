import router from './routes/routes.js';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
app.use(router);

app.listen(process.env.API_PORT, () =>
console.log('express is working!'));
