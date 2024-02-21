import { Userservice } from "../services/users.service.js";
import middlewares from "../middleware/middlewares.js";
import bcrypt from 'bcrypt';

export class usersController {
    userservice = new Userservice();

    createUser = async (req, res, next) => {
        try {
            const { email, password, passwordconfirm, name } = req.body;

            if (!email) {
                return res.status(400).json({ message: '유효하지 않는 이메일 입니다.' });
            }
    
            if (!password) {
                return res.status(400).json({ message: '유효하지 않는 비밀번호 입니다.' });
            }

            if (!name) {
                return res
                    .status(400)
                    .json({ message: '유효하지 않는 이름입니다.' });
            }
    
            if (password.length < 6) {
                return res.status(400).json({ message: '6자 이상으로 비밀번호를 설정해주세요.'});
            }
    
            if (!passwordconfirm) {
                return res.status(400).json({ message: '비밀번호 확인란이 채워지지 않았습니다.'});
            }

    
            if (password !== passwordconfirm) {
                return res.status(400).json({ message: '비밀번호와 비밀번호 확인란이 일치하지 않습니다.'});
            }

            const usersdata = await this.userservice.findUser(email);

            if(usersdata){
                return res.status(400).json({ message: '이미 존재하는 계정입니다.'});
            };
            
            const createduser = await this.userservice.createUser(
                email,
                password,
                passwordconfirm,
                name
            );

            return res.status(201).json({ data: createduser });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: '심각한 오류' });
        }
    };

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const { user, token } = await this.userservice.login(email, password);

             if(user === null){
                return res.status(400).json({ message: '존재하지 않는 유저입니다.'});
            }

            if (!email) {
                return res.status(400).json({ message: '이메일이 입력되지 않았습니다.'});
            }
    
            if (!password) {
                return res.status(400).json({ message: '비밀번호가 입력되지 않았습니다.'});
            }
    
            if (!(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.'});
            }

            res.cookie('acess_token', `Bearer ${token}`);

            return res.status(201).json({ message: '로그인 완료' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: '심각한 오류' });
        }
    };
}
