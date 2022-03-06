import { Request, Response } from 'express';
import responseGenerator from '../../utility/responseGenerator';
import ProductModel from './product.model';

export const getAllProduct = async (req: Request, res: Response) => {
    try {
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );

        let query = ProductModel.find(JSON.parse(queryStr));

        const sort = req?.query?.sort as string;
        if (sort) {
            const sortBy = sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // 3) Field limiting
        const fields = req.query.fields as string;

        if (fields) {
            const fieldString = `${fields.split(',').join(' ')}`;
            query = query.select(fieldString);
        } else {
            query = query.select('-__v');
        }

        // 4) Pagination
        const page = req.query.page as string;
        const limit = req.query.limit as string;
        const queryPage: number = +page || 1;
        const queryLimit: number = +limit || 10;
        const querySkip = (queryPage - 1) * queryLimit;

        if (page) {
            const productNumber = await ProductModel.countDocuments();
            if (querySkip >= productNumber)
                throw new Error('This page does not exist.');
        }

        query = query.skip(querySkip).limit(queryLimit);

        // execute the query

        const products = await query;

        return res.json(responseGenerator(products, '', false));
    } catch (err: any) {
        return res
            .status(500)
            .json(responseGenerator('fail', err.message, true));
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const Product = await ProductModel.create(req.body);
        res.status(201).json(
            responseGenerator(Product, 'Product added successfully', false)
        );
    } catch (error: any) {
        res.status(500).json(responseGenerator('fail', error.message, true));
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const Product = await ProductModel.findByIdAndUpdate(
            req.params.id,
            req.body
        );
        res.status(201).json(
            responseGenerator(Product, 'Product update successfully', false)
        );
    } catch (error: any) {
        return res
            .status(500)
            .json(responseGenerator('fail', error.message, true));
    }
};

export const getProductByID = async (req: Request, res: Response) => {
    try {
        const Product = await ProductModel.findById(req.params.id);
        res.status(201).json(responseGenerator(Product, '', false));
    } catch (error: any) {
        return res
            .status(500)
            .json(responseGenerator('fail', error.message, true));
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const Product = await ProductModel.findByIdAndDelete(req.params.id);
        res.status(201).json(
            responseGenerator(Product, 'Product deleted successfully', false)
        );
    } catch (error: any) {
        return res
            .status(500)
            .json(responseGenerator('fail', error.message, true));
    }
};

export const getProductStatistics = async (req: Request, res: Response) => {
    try {
        const stats = await ProductModel.aggregate([
            {
                $match: { star: { $gte: 0 } },
            },
            {
                $group: {
                    // _id: '$star',
                    _id: { $toUpper: '$category' },
                    numProduct: { $sum: 1 },
                    numRating: { $sum: '$starCount' },
                    avgRating: { $avg: '$star' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                },
            },
            {
                $sort: { avgPrice: 1 },
            },
            // {
            //     $match: { _id: { $ne: 'LAPTOP' } },
            // },
        ]);

        res.status(201).json(
            responseGenerator(stats, 'Product statistic', false)
        );
    } catch (error: any) {
        return res
            .status(500)
            .json(responseGenerator('fail', error.message, true));
    }
};

export const getMonthlyPlan = async (req: Request, res: Response) => {
    try {
        const year = +req.params.year;
        const plan = await ProductModel.aggregate([
            {
                $unwind: '$features',
            },
        ]);
        res.status(200).json({ status: 'success', data: plan });
    } catch (error: any) {
        return res
            .status(500)
            .json(responseGenerator('fail', error.message, true));
    }
};
