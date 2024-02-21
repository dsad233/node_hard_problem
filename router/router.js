import express from 'express';
import { prisma } from '../src/utils/prisma/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import tokenmiddle from '../src/middleware/middlewares.js';

const router = express.Router();


router.post('/register', async (req, res, next) => {
    //// 회원가입
    try {
        const { email, password, passwordconfirm, name } = req.body;

        if (!email) {
            return res
                .status(400)
                .json({ Message: '유효하지 않는 이메일 입니다.' });
        }

        if (!password) {
            return res
                .status(400)
                .json({ Message: '유효하지 않는 비밀번호 입니다.' });
        }

        if (!passwordconfirm) {
            return res
                .status(400)
                .json({ Message: '비밀번호 확인란이 채워지지 않았습니다.' });
        }

        if (!name) {
            return res
                .status(400)
                .json({ Message: '유효하지 않는 이름입니다.' });
        }

        if (password.email < 6) {
            return res
                .status(400)
                .json({ Message: '6자 이상 비밀번호를 설정해주세요' });
        }

        if (password !== passwordconfirm) {
            return res
                .status(400)
                .json({ Message: '비밀번호확인과 일치하지 않습니다.' });
        }

        const registerdata = await prisma.users.findFirst({
            where: { email },
        });

        if (registerdata) {
            return res
                .status(400)
                .json({ Message: '이미 존재하는 계정 입니다.' });
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.create({
            data: {
                email,
                password: hashedpassword,
                name,
            },
        });

        return res.status(201).json({ data: user });
    } catch (error) {
        console.log(error.name);
    }
});

router.post('/login', async (req, res, next) => {
    //// 로그인
    try {
        const { email, password } = req.body;
        const user = await prisma.users.findFirst({ where: { email } });

        if (!user) {
            return res
                .status(400)
                .json({ Message: '존재하지 않은 이메일입니다.' });
        }

        if (!password) {
            return res
                .status(400)
                .json({ Message: '비밀번호가 입력되지 않았습니다.' });
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res
                .status(400)
                .json({ Message: '비밀번호가 일치하지 않습니다.' });
        }

        const token = jwt.sign({ userId: user.userId }, 'secret-key', {
            expiresIn: '12h',
        });

        res.cookie('acess_token', `Bearer ${token}`);
        return res.status(201).json({ token });
        // Message: '로그인 완료'
    } catch (error) {
        console.log(error.name);
    }
});

router.post('/resume', tokenmiddle, async (req, res, next) => {
    //// 이력서 생성
    try {
        const { userId } = req.user;
        const { resumetitle, resumecontent } = req.body;

        if (!resumetitle) {
            return res
                .status(400)
                .json({ Message: '이력서 제목란을 작성해주세요.' });
        }

        if (!resumecontent) {
            return res
                .status(400)
                .json({ Message: '이력서 자기소개란을 작성해주세요.' });
        }
        


        const resumes = await prisma.resume.create({
            data: {
                resumetitle,
                resumecontent,
                resumestatus: 'APPLY',
                user: {
                    connect: {
                        userId: parseInt(userId),
                    },
                },
            },
        });


        return res.status(201).json({ data: resumes });
    } catch (error) {
        console.log(error.name);
    }
});

router.get('/acess', tokenmiddle, (req, res, next) => {
    //// 인증 성공시 인증 확인
    const { userId, email, name } = req.user;

    return res.status(201).json({
        userId: parseInt(userId),
        email,
        name,
    });
});

router.put('/resume/:resumeId', tokenmiddle, async (req, res, next) => {
    //// 이력서 수정
    try {
        const { userId } = req.user;
        const { resumeId } = req.params;
        const { resumetitle, resumecontent, resumestatus } = req.body;

        if (!userId) {
            return res
                .status(400)
                .json({ Message: '해당 유저는 존재하지 않습니다.' });
        }

        if (!resumetitle) {
            return res
                .status(400)
                .json({ Message: '이력서 제목란을 작성해주세요.' });
        }

        if (!resumecontent) {
            return res
                .status(400)
                .json({ Message: '이력서 자기소개란을 작성해주세요.' });
        }

        if (!resumestatus) {
            return res
                .status(400)
                .json({ Message: '이력서의 상태를 작성해주세요.' });
        }

        if (
            ![
                'APPLY',
                'DROP',
                'PASS',
                'INTERVIEW1',
                'INTERVIEW2',
                'FINAL_PASS',
            ].includes(resumestatus)
        ) {
            return res
                .status(400)
                .json({ Message: '상태 값이 올바르지 않습니다.' });
        }

        const resumeput = await prisma.resume.findFirst({
            where: {
                resumeId: parseInt(resumeId),
            },
        });

        if (!resumeput) {
            return res
                .status(400)
                .json({ Message: '존재하지 않는 이력서 입니다.' });
        }

        if (resumeput.userId !== parseInt(userId)) {
            return res
                .status(400)
                .json({ Message: '수정할 수 있는 권한이 없습니다.' });
        }

        const resumedata = await prisma.resume.update({
            where: { resumeId: parseInt(resumeId) },
            data: {
                resumetitle,
                resumecontent,
                resumestatus,
            },
        });

        return res.status(201).json({ data: resumedata });
    } catch (error) {
        console.log(error.name);
    }
});

router.delete('/resume/:resumeId', tokenmiddle, async (req, res, next) => {
    //// 이력서 삭제
    try {
        const { userId } = req.user;
        const { resumeId } = req.params;

        const resumedelete = await prisma.resume.findUnique({
            where: {
                resumeId: parseInt(resumeId),
            },
        });

        if (!resumedelete) {
            return res
                .status(400)
                .json({ Message: '존재하지 않는 이력서 입니다.' });
        }

        if (resumedelete.userId !== parseInt(userId)) {
            return res
                .status(400)
                .json({ Message: '수정할 수 있는 권한이 없습니다.' });
        }

        await prisma.resume.delete({
            where: { resumeId: parseInt(resumeId) },
        });

        return res.status(201).json({ Message: '삭제 완료' });
    } catch (error) {
        console.log(error.name);
    }
});

router.get('/resumeacess', async (req, res, next) => {
    //// 이력서 모든 목록 조회

    const orderkey = req.query.orderkey ?? 'resumeId';
    const ordervalue = req.query.ordervalue ?? 'desc';

    if (!['resumeId', 'status'].includes(orderkey)) {
        return res.status(400).json({
            Message: 'orderKey 가 올바르지 않습니다.',
        });
    }

    if (!['asc', 'desc'].includes(ordervalue.toLowerCase())) {
        return res.status(400).json({
            Message: 'ordervalue 가 올바르지 않습니다.',
        });
    }

    const user = await prisma.resume.findMany({
        select: {
            resumeId: true,
            resumetitle: true,
            resumecontent: true,
            resumestatus: true,
            user: {
                select: {
                    userId: true,
                    email: true,
                    name: true,
                },
            },
            createdAt: true,
            updatedAt: true,
        },
        orderBy: [
            {
                [orderkey]: ordervalue.toLowerCase(),
            },
        ],
    });

    if (!user) {
        return res
            .status(400)
            .json({ Message: '이력서 조회에 실패하였습니다.' });
    }

    return res.status(201).json({ data: user });
});

router.get('/resumeacess/:resumeId', async (req, res, next) => {
    //// 이력서 상세 목록 조회
    try {
        const { resumeId } = req.params;

        const users = await prisma.resume.findFirst({
            where: { resumeId: parseInt(resumeId) },
            select: {
                resumeId: true,
                resumetitle: true,
                resumecontent: true,
                resumestatus: true,
                user: {
                    select: {
                        userId: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });

        if (users === null) {
            return res
                .status(400)
                .json({ Message: '이력서 조회에 실패하였습니다.' });
        }

        return res.status(201).json({ data: users });
    } catch (error) {
        console.log(error.name);
    }
});

export default router;
