import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { PostsController } from '../controllers/posts.controller.js';
import { Postservice } from '../services/posts.service.js';
import { Postsrepository } from '../repositories/posts.repository.js';


const router = express.Router();

const postsRepository = new Postsrepository(prisma);
const postService = new Postservice(postsRepository);
const postcontroller = new PostsController(postService);



router.get('/', postcontroller.getPosts);
router.get('/:postId' , postcontroller.getPostById);
router.put('/:postId' , postcontroller.updatePost);
router.delete('/:postId' , postcontroller.deletePost);


export default router;