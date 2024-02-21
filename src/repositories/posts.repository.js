import { prisma } from '../utils/prisma/index.js';


export class Postsrepository {
    // constructor(prisma) {
    //   this.prisma = prisma;
    // }

    findAllPosts = async () => {
        // ORM인 Prisma에서 Posts 모델의 findMany 메서드를 사용해 데이터를 요청합니다.
        const resumes = await prisma.resume.findMany();

        return resumes;
    };

    findPostById = async (resumeId) => {
        // ORM인 Prisma에서 Posts 모델의 findUnique 메서드를 사용해 데이터를 요청합니다.
        const resumes = await prisma.resume.findUnique({
            where: { resumeId: +resumeId },
        });

        return resumes;
    };


    createPost = async (userId, resumetitle, resumecontent) => {
        // ORM인 Prisma에서 Posts 모델의 create 메서드를 사용해 데이터를 요청합니다.
        const createdPost = await prisma.resume.create({
            data: {
                resumetitle,
                resumecontent,
                resumestatus: 'APPLY',
                user: {
                    connect: {
                        userId: +userId,
                    },
                },
            },
        });

        return createdPost;
    };

    updatePost = async (
        userId,
        resumeId,
        resumetitle,
        resumecontent,
        resumestatus
    ) => {
        // ORM인 Prisma에서 Posts 모델의 update 메서드를 사용해 데이터를 수정합니다.\]\
        const post = await prisma.findUnique({
            where: { resumeId: +resumeId },
        });

        if (post.userId !== userId) {
            throw new Error('수정할 수 있는 권한이 존재하지 않습니다.');
        }

        const updatedPost = await prisma.resume.update({
            where: {
                resumeId: +resumeId,
            },
            data: {
                resumetitle,
                resumecontent,
                resumestatus,
            },
        });

        return updatedPost;
    };

    deletePost = async (userId, resumeId) => {
        // ORM인 Prisma에서 Posts 모델의 delete 메서드를 사용해 데이터를 삭제합니다.
        const post = await prisma.resume.findUnique({
            where: { resumeId: +resumeId },
        });

        if (post.userId !== userId) {
            throw new Error('수정할 수 있는 권한이 존재하지 않습니다.');
        }

        const deletedPost = await prisma.resume.delete({
            where: {
                resumeId: +resumeId,
            },
        });

        return deletedPost;
    };
}
