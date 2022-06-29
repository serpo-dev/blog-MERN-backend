import express from 'express';
import mongoose from 'mongoose';

import { registerValidation, loginValidation } from './validations/auth.js';
import { postCreateValidation } from './validations/posts.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';


mongoose
    .connect('mongodb+srv://yphwd:990615@cluster0.zdaa7kb.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('BD is OK'))
    .catch((err) => console.log('DB is not avaliable. Error type: ', err));

const app = express();
app.use(express.json()); // need to read json files in requests


app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/registration', registerValidation, UserController.register);


app.get('/posts', PostController.getAll);
// app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
// app.remove('/posts', PostController.remove);
// app.patch('/posts', PostController.update);



app.listen(4444, (err) => {
    if (err) {
        console.log(`error: ${err}`)
    };

    console.log('Server loaded successfully!');
});