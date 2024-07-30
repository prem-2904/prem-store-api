import express from 'express';
import { addProductStock, createProduct, getProductDetails, getProducts, getStocks, updateProduct, userProducts } from '../controllers/products.controller.js';

const productRouter = express.Router();

productRouter.post('/createProduct', createProduct);

productRouter.post('/addStocks/:productId', addProductStock);

productRouter.get('/getStocks/:productId', getStocks);

productRouter.get('/getProducts', getProducts);

productRouter.get('/getProducts/:sellerId', getProducts);

productRouter.get('/getProducts/product/:pid', getProductDetails);

productRouter.get('/userProducts', userProducts);

productRouter.post('/updateProduct/:productId', updateProduct);

export default productRouter;