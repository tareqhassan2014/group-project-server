import { Router } from 'express';
import {
    createProduct,
    deleteProduct,
    getAllProduct,
    getMonthlyPlan,
    getProductByID,
    getProductStatistics,
    updateProduct,
} from './product.controller';

const router = Router();

router.route('/').get(getAllProduct).post(createProduct);

router.route('/product-statistic').get(getProductStatistics);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router
    .route('/:id')
    .get(getProductByID)
    .patch(updateProduct)
    .delete(deleteProduct);
export default router;
