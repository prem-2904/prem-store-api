import offersModel from "../models/offers.model.js";
import { createError, createSuccess } from "../utils/response-structure.js"

export const createCoupon = async (req, res, next) => {
    try {
        const reqPayload = req.body;
        const offer = new offersModel({
            productId: reqPayload.productId,
            sellerId: reqPayload.sellerId,
            couponName: reqPayload.couponName,
            couponCode: reqPayload.couponCode,
            couponOfferType: reqPayload.couponOfferType,
            couponValue: reqPayload.couponValue,
            couponTerms: reqPayload.couponTerms,
            minPurchase: reqPayload.minPurchase,
            dateOfExpiry: reqPayload.dateOfExpiry,
            isDeleted: false
        });

        await offer.save();
        return next(createSuccess(201, 'Coupon created!', []));
    } catch (error) {
        return next(createError(500, 'Something went wrong' + error));
    }
}

export const getCouponDetails = async (req, res, next) => {
    try {
        const sellerId = req.params.sellerId;
        const couponDetails = await offersModel.find({ sellerId: sellerId }).populate({ path: 'productId', select: 'productName' })
        if (couponDetails.length > 0) {
            return next(createSuccess(200, '', couponDetails))
        }
        return next(createSuccess(200, 'No coupons found', []));
    } catch (error) {
        return next(createError(500, 'Something went wrong' + error));
    }
}


export const calculateCouponValue = async (req, res, next) => {
    try {
        let couponsDetails = await offersModel.find({ couponCode: req.body.couponCode, dateOfExpiry: { $gte: new Date() } });
        if (couponsDetails && couponsDetails.length > 0) {
            const coupon = couponsDetails[0];
            if (req.body.totalAmount > coupon.minPurchase) {
                let totalAmount = req.body.totalAmount;
                let calcAmount = 0;
                let discountedRate = 0;
                if (coupon.couponOfferType === 'Flat Discount') {
                    discountedRate = ((coupon.couponValue / 100) * req.body.totalAmount);
                    calcAmount = totalAmount - discountedRate;

                } else {
                    calcAmount = totalAmount - coupon.couponValue;
                    discountedRate = Number(coupon.couponValue);
                }
                console.log(discountedRate);
                return next(createSuccess(200, 'Coupon applied successfully', { couponId: coupon._id, discountedRate: discountedRate.toFixed(2), totalAmount: calcAmount.toFixed(2) }))
            } else {
                return next(createSuccess(403, `You're not eligible to avail this offer!! Minimum purchase of ${coupon.minPurchase} required`));
            }
        } else {
            return next(createSuccess(404, 'Coupon not found/expired', []))
        }
    } catch (error) {
        return next(createError(500, 'Something went wrong' + error));
    }
}