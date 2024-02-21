import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class Usersrepository {
    // constructor(prisma) {
    //   this.prisma = prisma;
    // }


    findUser = async (email) =>{
        const users = await prisma.users.findFirst({
            where: { email },
        });

        return users;
    }


    createUser = async (email, password, passwordconfirm, name) => {

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await prisma.users.create({
            data: {
                email,
                password : hashedPassword,
                name,
            },
        });
        return createdUser;
    };


    login = async (email, password) => {
        const user = await prisma.users.findFirst({
            where: { email },
        });

        if(user === null){
            return null;
        }

        const token = jwt.sign({ userId: user.userId }, 'secret-key', {
            expiresIn: '12h',
        });

        return { user, token }; 
    };
}
