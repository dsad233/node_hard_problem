import { Postsrepository } from '../repositories/posts.repository.js';
export class Postservice {
    postrepository = new Postsrepository();
    /// 목록 조회
    findAllPosts = async () => {
        const posts = await this.postrepository.findAllPosts();

        posts.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });

        return posts.map((resume) => {
            return {
                resumeId: resume.resumeId,
                resumetitle: resume.resumetitle,
                resumecontent: resume.resumecontent,
                resumestatus: resume.resumestatus,
                createdAt: resume.createdAt,
                updatedAt: resume.updatedAt,
            };
        });
    };

    createPost = async (resumetitle, resumecontent, resumestatus) => {

        const createPosts = await this.postrepository.createPost(
            resumetitle,
            resumecontent,
            resumestatus
        );

        return {
            resumeId: createPosts.resumeId,
            resumetitle: createPosts.resumetitle,
            resumecontent: createPosts.resumecontent,
            resumestatus: createPosts.resumestatus,
            createdAt: createPosts.createdAt,
            updatedAt: createPosts.updatedAt,
        };
    };
}
