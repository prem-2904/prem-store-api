import sellersModel from "../models/sellers.model.js";
import { generateToken } from "../utils/jwt-auth.js";
import { createError, createSuccess } from "../utils/response-structure.js";
import * as bcrypt from 'bcrypt';

export const createSeller = async (req, res, next) => {
    try {
        const sellerPayload = req.body;

        const password = req.body.sellerPassword;
        const saltKey = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, saltKey);

        const seller = new sellersModel({
            sellerName: sellerPayload.sellerName,
            sellerAddress: sellerPayload.sellerAddress,
            sellerContact: sellerPayload.sellerContact,
            sellerAvailableLocations: sellerPayload.sellerAvailableLocations,
            sellerCountry: sellerPayload.sellerCountry,
            sellerState: sellerPayload.sellerState,
            isDeleted: false,
            sellerMailId: sellerPayload.sellerMailId,
            sellerPassword: encryptedPassword
        });

        await seller.save();

        return next(createSuccess(201, 'Your account created successfully!'));
    } catch (error) {
        return next(createError(500, 'Something went wrong on creating seller account' + error, []));
    }
}

export const loginSeller = async (req, res, next) => {
    try {
        const seller = await sellersModel.findOne({ sellerMailId: req.body?.sellerMailId, isDeleted: false });
        if (seller) {
            const isValidPassword = bcrypt.compare(req.body?.sellerPassword, seller.sellerPassword);

            if (!isValidPassword) {
                return next(createError(200, 'Invalid password!', []));
            }

            generateToken(seller, res);

            return next(createSuccess(200, '', seller));
        }
        else {
            return next(createError(404, 'Your not registered with us! Please create your to account!', []));
        }
    } catch (error) {
        return next(createError(500, 'Something went wrong on seller login' + error, []))
    }
}

export const getSellersList = async (req, res, next) => {
    try {
        const sellers = await sellersModel.find();
        return next(createSuccess(200, '', sellers));
    } catch (error) {
        return next(createError(500, 'Something went wrong on seller lists' + error, []))
    }
}