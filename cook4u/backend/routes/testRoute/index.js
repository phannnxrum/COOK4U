import express from 'express';
import { getTest, postTest } from '../../controllers/test/index.js';

const testRouter = express.Router();

testRouter.get('/', (req, res) => {
    getTest(req, res);
});
testRouter.post('/', (req, res) => {
    postTest(req, res);
});

export default testRouter;
