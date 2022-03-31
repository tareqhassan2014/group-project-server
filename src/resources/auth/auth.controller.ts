import { NextFunction, Request, Response } from 'express';
import jwt from '../../library/jwt';
import responseGenerator from '../../utility/responseGenerator';
import UserModel from './auth.model';

export const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const body = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
        };

        const user = await UserModel.create(body);
        const token = jwt.issueJWT(user);

        return res.json({ user, token });
    } catch (err: any) {
        return res
            .status(500)
            .json(responseGenerator('fail', err.message, true));
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json('no user With this email');
        }
        const isValidPassword = await user.isValidPassword(password);
        if (!isValidPassword) {
            return res.status(400).json('incorrect email or password');
        }

        const token = jwt.issueJWT(user);
        return res.json({ user, token });
    } catch (err: any) {
        return res.status(500).json(err.message);
    }
};
