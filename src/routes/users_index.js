import express from 'express';
import registers from './users.router.js';

const router = express.Router();


router.use('/register', registers);



export default router;
