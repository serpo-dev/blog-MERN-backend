import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import PostModel from '../models/Post.js';


export const getAll = async (req, res) => {
    try {
        // find  - получаем все объекты массива
        // populate - подключение ранее указанной связи в 'user' из PostSchema
        // exec - выполнили запрос
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);

    } catch (err) {
        res
            .status(500)
            .json({
                message: 'Server can\'t get all posts'
            });
    };
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        });

        const post = await doc.save();

        res.json(post);

    } catch (err) {
        res
            .status(500)
            .json({
                message: 'Server can\'t create a post'
            });
    };
};

