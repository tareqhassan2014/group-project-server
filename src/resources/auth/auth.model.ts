import bcrypt from 'bcrypt';
import mongoose, { model, Schema } from 'mongoose';
import IUser from './auth.interface';

const UserModel = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required!'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required!'],
            trim: true,
            lowercase: true,
            unique: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number id required'],
        },
        role: {
            type: String,
            default: 'user',
            enum: ['admin', 'merchant', 'user'],
        },
        status: {
            type: String,
            default: 'pending',
            enum: ['pending', 'verified', 'blocked'],
        },
        img: String,
        password: {
            type: String,
            required: [true, 'Password is required!'],
            minlength: [
                6,
                'Password should be greater than or equal 6 character!',
            ],
        },
    },
    { timestamps: true }
);

UserModel.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

UserModel.path('email').validate(async (email: string) => {
    return !(await mongoose.models.User.countDocuments({ email }));
});

UserModel.methods.isValidPassword = async function (
    password: string
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password);
};

export default model<IUser>('User', UserModel);
