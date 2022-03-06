import jwt from 'jsonwebtoken';
import IUser from '../resources/auth/auth.interface';

const jwtSecret = process.env.JWT_SECRET as jwt.Secret;

class Jwt {
    issueJWT(user: IUser) {
        const _id = user._id;

        const filteredUserData = {
            role: user.role,
            _id: _id,
            status: user.status,
            email: user.status,
        };

        const payload = {
            ...filteredUserData,
            sub: _id,
            iat: new Date().getTime() / 1000,
        };

        const signedToken = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
        return 'Bearer ' + signedToken;
    }

    async verifyJWT(accessToken: string) {
        try {
            return await jwt.verify(accessToken, jwtSecret);
        } catch (err) {
            return false;
        }
    }
}

export default new Jwt();
