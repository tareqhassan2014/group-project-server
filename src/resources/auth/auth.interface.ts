import { Document } from 'mongoose';

export default interface IUser extends Document {
    name: string;
    email: string;
    _id: string;
    password: string;
    role: string;
    img?: string;
    phone: string;
    status: string;
    isValidPassword(password: string): Promise<Error | boolean>;
}
