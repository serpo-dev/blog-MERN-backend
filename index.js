import express from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { registerValidation } from './validations/auth.js'
import UserModel from './models/User.js'


mongoose
    .connect('mongodb+srv://yphwd:990615@cluster0.zdaa7kb.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('BD is OK'))
    .catch((err) => console.log('DB is not avaliable. Error type: ', err))



const app = express();
app.use(express.json()); // need to read json files in requests

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return req
                .status(404)
                .json({ message: 'wrong login or password' });
        };

        // compare entered and database passwords
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return req
                .status(404)
                .jsom({ message: 'wrong login or password' });
        };

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret123',
            {
                expiresIn: '30d'
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: 'Server can\'t authorize you'
            });
    };
});

app.post('/auth/registration', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        };

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret123',
            {
                expiresIn: '30d'
            }
        );

        // destructuration to hide 'passwordHash' at a response
        const {
            passwordHash,
            ...userData
        } = user._doc;

        // response
        res.json({
            ...userData,
            token
        }
        );

    } catch (err) {
        console.log(err)
        res
            .status(500)
            .json({
                message: 'Wow! You failed to register.'
            });
    };
});


app.listen(4444, (err) => {
    if (err) {
        console.log(`error: ${err}`)
    };

    console.log('Server loaded successfully!');
});