//check if there's  information in the body and validate it
import { body } from 'express-validator';


export const postCreateValidation = [
    body('title', 'Length need to be at least 1 charachter').isLength({ min: 1 }).isString(),
    body('text', 'Length need to be at least 1 charachter').isLength({ min: 1 }).isString(),
    body('imageUrl', 'Your link does not look like any true link').optional().isString()
];