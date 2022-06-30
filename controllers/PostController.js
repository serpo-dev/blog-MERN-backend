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

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;


        // 1 - что найти, 2 - что обновить, 3 - что вернуть
        PostModel.findOneAndUpdate(
            {
                _id: postId
            },
            {
                // syntax of mongo db helps to increment something 
                $inc: { viewsCount: 1 }
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if (err) {
                    return res
                        .status(500)
                        .json({
                            message: 'Server can\'t find one or update views counter'
                        });
                };

                if (!doc) {
                    return res
                        .status(404)
                        .json({
                            message: 'The post doesn\'t exist.'
                        });
                };

                res.json(doc);
            }
        );

    } catch (err) {
        res
            .status(500)
            .json({
                message: 'Server can\'t process the request'
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

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete(
            {
                _id: postId
            },
            (err, doc) => {
                if (err) {
                    return res
                        .status(500)
                        .json({
                            message: 'Server can\'t delete a post'
                        });
                };

                if (!doc) {
                    return res
                        .status(404)
                        .json({
                            message: 'The post doesn\'t exist.'
                        });
                };

                res.json({
                    success: true
                });
            }
        );



    } catch (err) {
        res
            .status(500)
            .json({
                message: 'Server can\'t process the request'
            });
    };
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if (err) {
                    return res
                        .status(500)
                        .json({
                            message: 'Server can\'t find one or update views counter'
                        });
                };

                if (!doc) {
                    return res
                        .status(404)
                        .json({
                            message: 'The post doesn\'t exist.'
                        });
                };

                res.json(doc);
            }
        );

    } catch (err) {
        res
            .status(500)
            .json({
                message: 'Server can\'t process the request'
            });
    };
};