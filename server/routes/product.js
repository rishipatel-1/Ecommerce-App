import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = Router();

router.get('/products', getProducts);

router.get('/products/:id', getProductById);

router.post(
  '/products',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('imageUrls').isArray().withMessage('Image URLs must be an array'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('status').trim().notEmpty().withMessage('Status is required'),
  ],
  createProduct
);

router.put(
  '/products/:id',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('imageUrls').isArray().withMessage('Image URLs must be an array'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('status').trim().notEmpty().withMessage('Status is required'),
  ],
  updateProduct
);

router.delete('/products/:id', deleteProduct);

export default router;
