import express from 'express';
import postrouter from '../node_hard_project/router/router.js';
import cookie from 'cookie-parser';



const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookie());



app.use('/api', [postrouter]);

app.listen(PORT, () => {
    console.log(PORT, "에 연결되었습니다.");
});