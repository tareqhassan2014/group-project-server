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

        return res.json(
            responseGenerator(
                {
                    name: user.name,
                    email: user.email,
                    id: user._id,
                    img: user.img,
                    role: user.role,
                    status: user.status,
                    token,
                },
                'Login successful!',
                false
            )
        );
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
    console.log(email);
    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res
                .status(500)
                .json(
                    responseGenerator('fail', 'no user with this email', true)
                );
        }
        const isValidPassword = await user.isValidPassword(password);
        if (!isValidPassword) {
            return res
                .status(500)
                .json(
                    responseGenerator(
                        'fail',
                        'incorrect email or password',
                        true
                    )
                );
        }

        const token = jwt.issueJWT(user);
        return res.json(
            responseGenerator(
                {
                    name: user.name,
                    email: user.email,
                    id: user._id,
                    img: user.img,
                    role: user.role,
                    status: user.status,
                    token,
                },
                'Login successful!',
                false
            )
        );
    } catch (err: any) {
        return res
            .status(500)
            .json(responseGenerator('fail', err.message, true));
    }
};
