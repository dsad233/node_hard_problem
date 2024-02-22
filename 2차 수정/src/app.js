import express from 'express';
import postrouter from './routes/posts.router.js';
import userrouter from './routes/user.router.js';
import authrouter from './routes/auth.router.js';

const app = express();
const port = 3000;


app.use(express.json());
app.use('/auth', authrouter);
app.use('/posts', postrouter);
app.use('/users', userrouter);


app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});

