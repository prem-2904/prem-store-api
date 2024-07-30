import express from 'express';
import { createSeller, getSellersList, loginSeller } from '../controllers/sellers.controller.js';

const sellerRouter = express.Router();

sellerRouter.post("/createSeller", createSeller);

sellerRouter.post("/validate", loginSeller);

sellerRouter.get('/getSellers', getSellersList);//admins only

export default sellerRouter;