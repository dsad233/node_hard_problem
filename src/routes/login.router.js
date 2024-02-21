import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { Userservice } from '../services/users.service.js';
import { Usersrepository } from '../repositories/users.repository.js';
import { usersController } from '../controllers/users.controller.js';


const router = express.Router();

const usersrepository = new Usersrepository(prisma);
const userservice = new Userservice(usersrepository);
const userController = new usersController(userservice);



router.post('/', userController.login);




export default router;