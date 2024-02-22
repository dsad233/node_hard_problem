import express from 'express';
import { PostsController } from '../controllers/posts.controller.js';
import { Postservice } from '../services/posts.service.js';
import { Postsrepository } from '../repositories/posts.repository.js';
import middleware from '../middleware/middlewares.js';
import { PrismaClient } from '@prisma/client';


const router = express.Router();
const prisma = new PrismaClient();

const postsrepository = new Postsrepository(prisma);
const postservice = new Postservice(postsrepository);
const postsController = new PostsController(postservice);


router.get('/', postsController.getPosts);

router.get('/:resumeId', postsController.getPostId);

router.post('/', middleware, postsController.Postadd);

router.patch('/:resumeId', middleware, postsController.postput);

router.delete('/:resumeId', middleware,  postsController.postdelete)

export default router;