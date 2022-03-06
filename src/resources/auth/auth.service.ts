import Jwt from '../../library/jwt';
import userModel from './auth.model';

class UserService {
    private user = userModel;

    /* 
    Register new user
    */

    public async register(
        name: string,
        email: string,
        password: string,
        role: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.create({
                name,
                email,
                password,
                role,
            });

            const accessToken = Jwt.issueJWT(user);
            return accessToken;
        } catch (error) {
            throw new Error('Can not create new user');
        }
    }

    /* 
    Attempt to login a user
    */

    public async login(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.findOne({ email });
            if (!user) {
                throw new Error('Now use on this email');
            }

            if (await user.isValidPassword(password)) {
                return Jwt.issueJWT(user);
            } else {
                throw new Error('invalid credentials given');
            }
        } catch (error) {
            throw new Error('can not login now try agin later');
        }
    }
}

export default new UserService();
