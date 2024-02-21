import { Postservice } from '../services/posts.service.js';

export class PostsController {
    postservices = new Postservice();
    getPosts = async (req, res) => {
        try {
            const posts = await this.postservices.findAllPosts();

            return res.status(200).json({ data: posts });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: '심각한 오류' });
        }
    };

    getPostById = async (req, res) => {
        try {
            const { resumeId } = req.parmas;

            const post = await this.postservices.findPostById(resumeId);

            return res.status(200).json({ data: post });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: '심각한 오류' });
        }
    };

    createPost = async (req, res, next) => {
        try {
            const { resumetitle, resumecontent, resumestatus } = req.body;

            const createdpost = await this.postservices.createPost(
                resumetitle,
                resumecontent,
                resumestatus
            );

            return res.status(201).json({ data: createdpost });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: '심각한 오류' });
        }
    };

    updatePost = async (req, res, next) => {
        try {
            const { resumeId } = req.parmas;
            const { resumetitle, resumecontent, resumestatus } = req.body;

            await this.postservices.findPostById(resumeId);

            const postupdate = await this.postservices.updatePost(
                resumetitle,
                resumecontent,
                resumestatus
            );

            return res.status(200).json({ data: postupdate });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: '심각한 오류' });
        }
    };

    deletePost = async (req, res, next) => {
        try {
            const { resumeId } = req.parmas;

            await this.postservices.deletePost(resumeId); // user 인증이 개입된다면

            return res.status(200).json({ message: '삭제 완료' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: '심각한 오류' });
        }
    };
}
