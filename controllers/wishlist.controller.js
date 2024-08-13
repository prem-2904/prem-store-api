import cartModel from "../models/cart.model.js";
import wishlistModel from "../models/wishlist.model.js";
import { createError, createSuccess } from "../utils/response-structure.js";

export const markWishlist = async (req, res, next) => {
    try {
        const wishList = new wishlistModel({
            userId: req.body.userId,
            itemId: req.body.itemId,
            markedFav: req.body.markedFav,
            isDeleted: false
        });

        await wishList.save();
        return next(createSuccess(201, 'Added to wishlist', wishList._id));
    } catch (error) {
        return next(createError(500, 'Something went wrong' - error))
    }
}

export const removeWishList = async (req, res, next) => {
    try {
        const wishListId = await wishlistModel.findById({ _id: req.body.id });

        if (wishListId) {
            await wishlistModel.findByIdAndUpdate(
                req.body.id,
                { $set: req.body.details },
            )
            return next(createSuccess(200, 'Removed from wishlist'));
        }
        return next(createError(404, 'Item not found'));
    } catch (error) {
        return next(createError(500, 'Something went wrong' + error))
    }
}

export const getUserWishList = async (req, res, next) => {
    try {
        const wishListed = await wishlistModel.find({ userId: req.query.id, isDeleted: false })
            .populate(
                {
                    path: 'itemId',
                    populate: { path: 'availabilityStocks', model: "product-stocks" }
                })
        return next(createSuccess(200, '', wishListed));
    } catch (error) {
        return next(createError(500, 'Something went wrong' - error))
    }
}


export const addToCart = async (req, res, next) => {
    try {
        const payload = req.body;
        if (payload?.cartId) {
            const isAlready = await cartModel.find({ _id: payload?.cartId, isDeleted: false })
            if (isAlready) {
                await cartModel.findByIdAndUpdate(payload.id, { $set: payload })
                return next(createSuccess(200, 'Item removed from cart', []));
            }
        }
        const cart = new cartModel({
            userId: payload.userId,
            itemId: payload.itemId,
            addedToCart: payload.addedToCart,
            isDeleted: false
        });
        await cart.save();
        return next(createSuccess(201, 'Added to cart', { cartId: cart._id }));
    } catch (error) {
        console.log("error", error);
        return next(createError(500, 'Something went wrong' - error))
    }
}

export const removeFromCart = async (req, res, next) => {
    try {
        const cartId = await cartModel.findById({ _id: req.body.id });

        if (cartId) {
            const cart = await cartModel.findByIdAndUpdate(
                req.body.id,
                { $set: req.body.details },
            )
            return next(createSuccess(200, 'Removed from cart', cart._id));
        }
        return next(createError(404, 'Item not found'));
    } catch (error) {
        return next(createError(500, 'Something went wrong' - error))
    }
}

export const getUserCart = async (req, res, next) => {
    try {
        const params = { isDeleted: false, userId: req.query.id };
        if (req.query?.productId) {
            params.itemId = req.query?.productId
        }
        const cart = await cartModel.find(params)
            .populate(
                {
                    path: 'itemId',
                    populate: { path: 'availabilityStocks', model: "product-stocks" }
                })
        return next(createSuccess(200, '', cart));
    } catch (error) {
        return next(createError(500, 'Something went wrong' + error))
    }
}

export const isProductWishlistCart = async (req, res, next) => {
    try {
        const params = { isDeleted: false, userId: req.query.userId, itemId: req.query.productId };
        const cartDetails = (await cartModel.find(params)).length > 0;
        const wishlistDetails = (await wishlistModel.find(params)).length > 0;
        return next(createSuccess(200, '', { isAddedToCart: cartDetails, isWishlisted: wishlistDetails }));
    } catch (error) {
        return next(createError(500, 'Something went wrong' + error));
    }
}


export const getCounts = async (req, res, next) => {
    try {
        const cartCount = await cartModel.find({ userId: req.query.id, isDeleted: false }).countDocuments();
        const wishListCount = await wishlistModel.find({ userId: req.query.id, isDeleted: false }).countDocuments();
        return next(createSuccess(200, '', { cartCount, wishListCount }));
    } catch (error) {
        return next(createError(500, 'Something went wrong' + error))
    }
}

export const validateStocksForCartItems = async (req, res, next) => {
    try {
        return next(createSuccess(200, 'Good to go!'));
    } catch (error) {
        return next(createError(500, 'Something went wrong' + error))
    }
}


export const updateCartItemQuantity = async (req, res, next) => {
    try {
        await cartModel.findByIdAndUpdate(req.body.id, { quantity: req.body.quantity });
        return next(createSuccess(200, 'Cart quantity updated!'));
    } catch (error) {
        return next(createError(500, 'Something went wrong' + error))
    }
}