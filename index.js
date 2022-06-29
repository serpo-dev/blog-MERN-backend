import express from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';


import registerValidation from './validations/auth.js'


mongoose
    .connect('mongodb+srv://yphwd:990615@cluster0.zdaa7kb.mongodb.net/?retryWrites=true&w=majority')
    .then(() => { console.log('BD is OK') })
    .catch((err) => { console.log('DB is not avaliable. Error type: ', err) })



const app = express();
app.use(express.json()); // need to read json files in requests


app.post('/auth/registration', registerValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    };

    res.json({
        success: true
    });
});


app.listen(4444, (err) => {
    if (err) {
        console.log(`error: ${err}`)
    };

    console.log('Server loaded successfully!');
});