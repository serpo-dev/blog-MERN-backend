import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { registerValidation, loginValidation } from './validations/auth.js';
import { postCreateOrUpdateValidation } from './validations/posts.js';
import { handleValidationsErrors, checkAuth } from './utils/utils.js';
import { UserController, PostController } from './controllers/controllers.js';

mongoose
    .connect('mongodb+srv://yphwd:990615@cluster0.zdaa7kb.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('BD is OK'))
    .catch((err) => console.log('DB is not avaliable. Error type: ', err));


const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
        // 1 - не возвращает ошибок
        // 2 - загружает файлы в папку uploads
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
        // 2 - присваивает файлу оригинальное название
    }
});

const upload = multer({ storage });


const app = express();
app.use(express.json()); // need to read json files in requests

// когда приходит запрос на адрес (1), то экспресс перенаправляет
// в папку (2) "uploads" (в противном случае он пытался бы применить 
// метод GET при открытии ссылки в браузере).
// Таким образом, мы делаем запрос на получение статичного файла.
app.use('/uploads', express.static('uploads'));

app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/auth/login', loginValidation, handleValidationsErrors, UserController.login);
app.post('/auth/registration', registerValidation, handleValidationsErrors, UserController.register);

app.post('/upload', checkAuth, upload.single(), (req, res) => {
    res.json({
        url: `./uploads/${req.file.originalname}`
    })
})

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateOrUpdateValidation, handleValidationsErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateOrUpdateValidation, handleValidationsErrors, PostController.update);



app.listen(4444, (err) => {
    if (err) {
        console.log(`error: ${err}`)
    };

    console.log('Server loaded successfully!');
});