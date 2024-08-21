import sellerRouter from './sellers.route.js';
import userRouter from './users.route.js';
import wishlistRouter from './wishlist.route.js';
import orderRoutes from './order.route.js';
import dashboardRoutes from './dashboard.route.js';
import offerRouter from './offer.route.js';
import productRouter from './product.route.js';
import ratingRoutes from './rating.route.js';

export const routerURLs = (app) => {
    try {
        app.use('/api/product', productRouter);
        app.use('/api/seller', sellerRouter);
        app.use('/api/users', userRouter);
        app.use('/api/wishlist', wishlistRouter);
        app.use('/api/order', orderRoutes);
        app.use('/api/stats', dashboardRoutes);
        app.use('/api/offers', offerRouter);
        app.use('/api/rating', ratingRoutes)
    } catch (error) {
        console.log("error", error)
    }
}