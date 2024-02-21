import express from 'express';
import postrouter from './routes/post_index.js';
import userrouter from './routes/users_index.js';
import logins from './routes/login_index.js';

const app = express();
const port = 3000;


app.use(express.json());
app.use('/api', postrouter);
app.use('/user', userrouter);
app.use('/users', logins);


app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
