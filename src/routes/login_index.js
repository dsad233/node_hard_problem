import express from 'express';
import logins from './login.router.js';

const router = express.Router();



router.use('/login', logins);



export default router;
