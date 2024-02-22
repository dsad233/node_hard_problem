import jwtwebToken from 'jsonwebtoken';
import {Usersrepository} from '../repositories/users.repository.js';

export class authServices {
    usersrepository = new Usersrepository();
    usertoken = async (refreshToken) => {
        const token = jwtwebToken.verify(refreshToken, 'resume&%*');
        if (!token.userId) {
            throw{ code : 401,
                    message : '사용자 정보가 올바르지 않습니다.'};
        }

    
        const user = await this.usersrepository.findById(token.userId);

    
        if (!user) {
            throw{ code : 401,
                message : '토큰 정보가 올바르지 않습니다.'};
        }
    
        // freshToken 유효함 -> accessToken, refreshToken 재발급
        const newAccessToken = jwtwebToken.sign({ userId: user.userId }, 'resume@#', { expiresIn: '12h' });
        const newRefreshToken = jwtwebToken.sign({ userId: user.userId }, 'resume&%*', { expiresIn: '7d' });
    
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        }
    }
}


