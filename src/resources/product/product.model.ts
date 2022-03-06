import { model, Schema } from 'mongoose';
import IProduct from './product.interface';

const ProductModel = new Schema(
    {
        category: {
            type: String,
            required: [true, 'A product must under a category'],
            enum: {
                values: ['laptop', 'camera', 'android'],
                message: 'We are listing only laptop, camera, android',
            },
        },
        name: {
            type: String,
            unique: true,
            required: [true, 'Name is Required!'],
            maxlength: [120, "Name can't longer than 120 character"],
            minlength: [10, "Name can't shorter than 10 character"],
        },
        seller: String,
        wholePrice: String,
        priceFraction: String,
        stock: Number,
        star: {
            type: Number,
            min: [1, 'Rating must be above 1'],
            max: [5, 'Rating must be below'],
        },
        starCount: Number,
        img: String,
        url: String,
        features: [Object] || [],
        price: {
            type: Number,
            required: true,
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (this: any, val: number) {
                    return val < this.price;
                },
            },
            message: 'Discount price ({VALUE}) should be blow regular price.',
        },
        shipping: Number,
        publish: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

ProductModel.virtual('discount').get(function (this: IProduct) {
    return this.price / 10;
});

//Document middleware function work before .save() and .create() method and don't work on .insertMany()
// ProductModel.pre<IProduct>('save', async function (next) {
//     console.log(this);
//     //Do something
//     next();
// });

// ProductModel.post<IProduct>('save', async function (document, next) {
//     console.log(document);
//     //do something
//     next();
// });

ProductModel.pre(/^find/, function (next) {
    this.find({ publish: { $ne: true } });
    next();
});

// ProductModel.post(/^find/, function (doc, next) {
//     next();
// });

//Aggregation middleware

// ProductModel.pre('aggregate', function (next) {
//     this.pipeline().unshift({ $match: { publish: { $ne: true } } });
//     next();
// });

export default model<IProduct>('Product', ProductModel);
