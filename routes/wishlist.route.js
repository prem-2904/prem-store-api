import express from "express";
import { addToCart, getCounts, getUserCart, getUserWishList, isProductWishlistCart, markWishlist, removeFromCart, removeWishList, updateCartItemQuantity } from "../controllers/wishlist.controller.js";
import { validateStocksBeforeCheckout } from "../controllers/products.controller.js";

const wishlistRouter = express.Router();

wishlistRouter.post('/markforwishlist', markWishlist);

wishlistRouter.post('/removewishlist', removeWishList);

wishlistRouter.get('/getwishlist', getUserWishList);

wishlistRouter.post('/addtocart', addToCart);

wishlistRouter.put('/removecartitem', removeFromCart);

wishlistRouter.get('/getusercart', getUserCart);

wishlistRouter.get('/isItemWishlistCart', isProductWishlistCart);

wishlistRouter.get('/getcounts', getCounts);

wishlistRouter.get('/validateCheckout/:userId', validateStocksBeforeCheckout);

wishlistRouter.put('/updateQuantity', updateCartItemQuantity);

export default wishlistRouter;