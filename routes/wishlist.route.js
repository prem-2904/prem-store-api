import express from "express";
import { addToCart, getCounts, getUserCart, getUserWishList, isProductWishlistCart, markWishlist, removeFromCart, removeWishList } from "../controllers/wishlist.controller.js";

const wishlistRouter = express.Router();

wishlistRouter.post('/markforwishlist', markWishlist);

wishlistRouter.post('/removewishlist', removeWishList);

wishlistRouter.get('/getwishlist', getUserWishList);

wishlistRouter.post('/addtocart', addToCart);

wishlistRouter.post('/removecartitem', removeFromCart);

wishlistRouter.get('/getusercart', getUserCart);

wishlistRouter.get('/isItemWishlistCart', isProductWishlistCart);

wishlistRouter.get('/getcounts', getCounts);


export default wishlistRouter;