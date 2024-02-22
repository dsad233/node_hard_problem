import { Postsrepository } from '../repositories/posts.repository.js';
export class Postservice {
    postrepository = new Postsrepository();
    findsortPosts = async (sort) => {
        const resumes = await this.postrepository.selectsortPosts(sort);
        return resumes;
    } 

    findPostId = async (resumeId) => {
        const resumes = await this.postrepository.selectoneposts(resumeId);
        return resumes;
    }

    Postadd = async (data) => {
        const resumeadd = await this.postrepository.create({
            resumetitle, resumecontent, userId
        }); 

        if (!resumeadd) {
            throw {
                code : 401,
                message: '존재하지 않는 이력서 입니다.',
            }
        }

        if (resumeadd.userId !== userId) {
            throw{ Message: '수정할 수 있는 권한이 없습니다.' };
        }

        await prisma.resume.create({
            data: {
                resumetitle,
                resumecontent,
                resumestatus: 'APPLY',
                userId: user.userId,
            }
        })

        return resumeadd;
    }


    postput = async (resumeId, data) => {

        const resume = await this.postrepository.selectoneposts(resumeId);

        if(!resume){
            throw {
                code : 401,
                message : '올바르지 않은 요청입니다'
            }
        }

        const { resumetitle, resumecontent, resumestatus } = data;
        await this.postrepository.update({resumeId,
            resumetitle,
            resumecontent,
            resumestatus})
    }

    postdelete = async (resumeId) => {
        const resume = await this.postrepository.deletepost(resumeId);

        if (!resume) {
            throw{
                code : 400,
                message: '존재하지 않는 이력서 입니다.',
            }
        }
    
        if (resume.userId !== userId) {
            throw{ Message: '수정할 수 있는 권한이 없습니다.' };
        }

        await this.postrepository.deletePost(resumeId);
    }
}
