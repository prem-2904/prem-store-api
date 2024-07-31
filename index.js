import express from 'express';
import dotenv from 'dotenv';
import productRouter from './routes/product.route.js';
import { connectToMongoDB } from './utils/database.js';
import cookieParser from 'cookie-parser';
import sellerRouter from './routes/sellers.route.js';
import cors from 'cors';
import userRouter from './routes/users.route.js';
import wishlistRouter from './routes/wishlist.route.js';
import orderRoutes from './routes/order.route.js';
import orderStatusModel from './models/orders/order.status.model.js';
import { ORDERSTATUS } from './models/orders/order-status.js';
import { whiteListUrls } from './utils/whitelist-urls.js';
dotenv.config();
connectToMongoDB();

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: whiteListUrls }));
app.use(cookieParser());

app.use('/api/product', productRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/users', userRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/order', orderRoutes);

app.use((err, req, res, next) => {
    const statusCode = err?.status || 500;
    const errorMessage = err?.message;

    res.status(statusCode).send({
        success: [200, 201, 204].some(a => a == err.status) ? true : false,
        message: errorMessage,
        status: statusCode,
        data: err.data,
        stack: err?.stack
    })
});

const pushStatus = () => {
    orderStatusModel.insertMany(ORDERSTATUS)
        .then(() => {
            console.log('Order status data initialized');
        })
        .catch(error => {
            console.error('Error initializing order status data:', error);
        });
}

// pushStatus();

app.listen(process.env.PORT, () => {
    console.log("Server started working on 3000");
})