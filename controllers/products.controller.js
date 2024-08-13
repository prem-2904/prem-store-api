import productStocksModel from "../models/product-stocks.model.js";
import productsModel from "../models/products.model.js";
import { createError, createSuccess } from "../utils/response-structure.js";
import stocksModel from '../models/product-stocks.model.js'
import cartModel from "../models/cart.model.js";

export const createProduct = async (req, res, next) => {
    try {
        const productPayload = req.body;

        const product = new productsModel({
            sellerId: productPayload.sellerId,
            productName: productPayload.productName,
            productDesc: productPayload.productDesc,
            productImages: productPayload.productImages,
            availabilityStocks: [],
            isDeleted: false,
            isAvailableForSale: false,
        });

        await product.save();
        return next(createSuccess(201, 'Product added successfully!', []));
    } catch (error) {
        return next(createError(500, 'Something went wrong with creation of product' + error, []));
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        let productId = req.params?.productId;
        const product = await productsModel.findById(productId);
        if (product) {
            if (req.body.fieldUpdate == 'isAvailableForSale' && req.body.isAvailableForSale) {
                const stocks = await productStocksModel.find({ productId: productId });
                console.log("sotckt", stocks);
                if (!stocks.length) {
                    return next(createError(400, 'Oops! No stocks added to this product! Please add stocks to release your product to public sale!'))
                }
            }
            await productsModel.findByIdAndUpdate(
                productId,
                { $set: req.body },
                { $new: true }
            );

            return next(createSuccess(200, 'Product updated successfully!', []));
        }
        else {
            return next(createError(404, 'Product not found!', []))
        }
    } catch (error) {
        return next(createError(500, 'Something went wrong with updating the product' + error, []));
    }
}

export const addProductStock = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const productDetails = await productsModel.findOne({ _id: productId, isDeleted: false });
        if (productDetails) {
            const stockPayload = req.body;
            const productStock = new productStocksModel({
                productId: productId,
                addedStockNos: stockPayload.addedStockNos,
                discount: stockPayload.discount,
                mrpPrice: stockPayload.mrpPrice,
                isDeleted: false,
                onSale: false
            });

            productDetails.availabilityStocks.push(productStock);

            Promise.all([productDetails.save(), productStock.save()]);

            return next(createSuccess(201, `Stocks added to ${productDetails.productName}`, []));
        } else {
            return next(createError(404, 'Product not found! Please add to available stocks', []));
        }

    } catch (error) {
        return next(createError(500, 'Something went wrong with adding stocks' + error, []));
    }
}

export const getProducts = async (req, res, next) => {
    try {
        const sellerId = req.params?.sellerId;
        const params = { isDeleted: false };
        if (sellerId) {
            params['sellerId'] = sellerId
        }
        const products = await productsModel.find(params).populate("availabilityStocks")
            .populate({ path: "sellerId", select: "sellerName" });
        console.log('products', products);
        if (products) {
            return next(createSuccess(200, '', products));
        }
        else {
            return next(createError(404, 'No products found!', []));
        }
    } catch (error) {
        return next(createError(500, 'Something went wrong with listing the products', []));
    }
}

export const getProductDetails = async (req, res, next) => {
    try {
        const productId = req.params?.pid;
        const params = { isDeleted: false };
        params['_id'] = productId
        const products = await productsModel.find(params).populate("availabilityStocks")
            .populate({ path: "sellerId", select: "sellerName" });
        if (products) {
            return next(createSuccess(200, '', products));
        }
        else {
            return next(createError(404, 'No products found!', []));
        }
    } catch (error) {
        return next(createError(500, 'Something went wrong with listing the products', []));
    }
}

export const getStocks = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const stocks = await productStocksModel.find({ productId: productId, isDeleted: false });
        return next(createSuccess(200, '', stocks));
    } catch (error) {
        return next(createError(500, 'Something went wrong with listing the stocks', []));
    }
}

export const userProducts = async (req, res, next) => {
    try {
        const products = await productsModel.find({ isAvailableForSale: true })
            .populate("availabilityStocks")
            .populate({ path: 'sellerId', select: "sellerName" });
        console.log('products', products[0].availabilityStocks);
        if (products) {
            return next(createSuccess(200, '', products));
        }
        else {
            return next(createError(404, 'No products found!', []));
        }
    } catch (error) {
        return next(createError(500, 'Something went wrong with listing the products', []));
    }
}

export const updateItemStock = async (req, res, next) => {
    try {
        if (!req.body) {
            return next(createError(400, 'Bad data request'));
        }

        const stockID = await stocksModel.findById({ _id: req.body.stockID });

        if (!stockID) {
            return next(createError(404, 'No items found to update'));
        }
        let existingStockCount = stockID?.addedStockNos;
        let updatedStockCount = 0;
        updatedStockCount = existingStockCount + req.body.stocks.addedStockNos;

        req.body.stocks["addedStockNos"] = updatedStockCount;

        await stocksModel.findByIdAndUpdate(
            req.body.stockID,
            { $set: req.body.stocks },
            { $new: true }
        )

        return next(createSuccess(200, 'Item stock updated successfully'));
    } catch (error) {
        return next(createError(500, `Internal Server Error ${error}`))
    }
}

export const updateStocksOnOrder = async (stockDetails) => {
    const stock = await stocksModel.findById({ _id: stockDetails.stockId });

    if (!stock) {
        return next(createError(404, 'No items found to update'));
    }
    let existingStockCount = stock?.addedStockNos;
    let orderedQuantity = stockDetails.orderedQuantity;
    let updatedStockCount = 0;
    if (existingStockCount < orderedQuantity) {
        let quan = orderedQuantity - existingStockCount;
        console.log("quan", quan)
        return next(createError(403, `Available quantity:${quan}`))
    }
    else if (stockDetails?.removeStock) {
        updatedStockCount = existingStockCount - orderedQuantity;
    }
    else {
        updatedStockCount = existingStockCount + orderedQuantity;
    }
    const payload = {
        addedStockNos: updatedStockCount
    }

    await stocksModel.findByIdAndUpdate(
        stockDetails.stockId,
        { $set: payload },
        { $new: true }
    )
}

export const searchProducts = async (req, res, next) => {
    try {
        const filterKey = new RegExp(req.query.search, 'i');
        const searchData = await productsModel.find({ productName: filterKey }).populate("availabilityStocks")
            .populate({ path: "sellerId", select: "sellerName" });
        return next(createSuccess(200, [], searchData));
    } catch (error) {
        return next(createError(500, 'Something went wrong' + error));
    }
}


export const validateStocksBeforeCheckout = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const availableStocks = {};
        const cartDetails = await cartModel.find({ userId: userId, isDeleted: false });
        if (cartDetails.length > 0) {
            let isGoodToCheckout = 0;
            for (let index = 0; index < cartDetails.length; index++) {
                const element = await stocksModel.find({ productId: cartDetails[index].itemId });
                console.log(element[0].addedStockNos)
                if (element[0].addedStockNos < cartDetails[index].quantity) {
                    availableStocks[cartDetails[index]._id] = { isGood: false, availableQuan: element[0].addedStockNos - cartDetails[index].quantity };
                } else {
                    isGoodToCheckout++;
                    availableStocks[cartDetails[index]._id] = { isGood: true };
                }
            }
            return next(createSuccess(201, '', { isGoodToCheckout: isGoodToCheckout === cartDetails.length, availableStocks }));
        } else {
            return next(createError(404, 'No cart items!!'));
        }
    } catch (error) {
        return next(createError(500, 'Something went wrong!' + error));
    }
}