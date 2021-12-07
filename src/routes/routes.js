import controllers from '../controller/controllers.js';
import express from 'express';

const routes = express.Router();

routes.get('/', controllers.rmchallenge);

export default routes;
