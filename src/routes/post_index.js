import express from 'express';
import Postrouter from './posts.router.js';

const router = express.Router();


router.use('/posts', Postrouter);



export default router;
