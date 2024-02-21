import { Usersrepository } from '../repositories/users.repository.js';
export class Userservice {
    usersrepository = new Usersrepository();
    /// 목록 조회
    createUser = async (email, password, passwordconfirm, name) => {

        const users = await this.usersrepository.createUser(
            email,
            password,
            passwordconfirm,
            name,
        );

        return {
            userId: users.userId,
            email: users.email,
            password: users.password,
            passwordconfirm: users.passwordconfirm,
            name: users.name,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        };
    };

    findUser = async (email) => {
        const users = await this.usersrepository.findUser(
            email,
        );

        return users;
    }

    login = async (email, password) => {

        const { user, token } = await this.usersrepository.login(email, password);


        if(user === null){
            return null;
        }
        
        return { user, token };
    };


    
}
