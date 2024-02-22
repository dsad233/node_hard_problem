import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authController } from '../controllers/auth.controller.js';
import { authServices } from '../services/auth.services.js';
import { Usersrepository } from '../repositories/users.repository.js';

const router = express.Router();
const prisma = new PrismaClient();

const usersrepository = new Usersrepository(prisma);
const authservices = new authServices(usersrepository);
const authcontroller = new authController(authservices);


router.get ('/token', authcontroller.genertoken);

export default router;


