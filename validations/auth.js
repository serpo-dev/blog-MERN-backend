//check if there's  information in the body and validate it
import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'O-ops! Invalid email format.').isEmail(),
    body('password', 'O-ops! Your password is too short.').isLength({ min: 6 }),
    body('fullName', 'O-ops! Your fullname is too short.').isLength({ min: 3 }),
    body('avatarUrl', 'O-ops! The type of string is not a link.').optional().isURL()
];

export const loginValidation = [
    body('email', 'O-ops! Invalid email format.').isEmail(),
    body('password', 'O-ops! Your password is too short.').isLength({ min: 6 }),
];