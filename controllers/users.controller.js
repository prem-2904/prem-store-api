import usersModel from "../models/users/users-model.js";
import { generateToken } from "../utils/jwt-auth.js";
import { createError, createSuccess } from "../utils/response-structure.js";
import bcrypt from 'bcrypt';

export const createUserAccount = async (req, res, next) => {
    try {
        let salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(req.body.password, salt);
        const userDetails = new usersModel({
            fullName: req.body.fullName,
            email: req.body.email,
            password: encryptedPassword,
            accountMode: req.body?.accountMode,
            isDeleted: false,
            profilePicture: req.body?.profilePicture
        });

        await userDetails.save();
        return next(createSuccess(201, 'Your account created! Please login with your credentials!', []));
    } catch (error) {
        return next(createError(500, 'Something went wrong on creating seller account' + error, []));
    }
}

export const validateUser = async (req, res, next) => {
    try {
        const isAccountExists = await usersModel.find({ email: req.body.email });
        console.log('aaccount=', isAccountExists);
        if (isAccountExists) {
            const userDetails = await bcrypt.compare(req.body.password, isAccountExists[0].password);
            if (!userDetails) {
                return next(createError(500, 'Incorrect password!', []));
            }

            generateToken(isAccountExists[0], res);

            return next(createSuccess(200, '', isAccountExists[0]));
        }
        else {
            return next(createError(404, 'Your email not found! Please create your account first!', []));
        }
    } catch (error) {
        return next(createError(500, 'Something went wrong on validating your account' + error, []));
    }
}

export const updateUser = async (req, res, next) => {
    try {
        if (req.body) {
            const user = await usersModel.findById({ _id: req.body.id });
            if (user) {
                await usersModel.findByIdAndUpdate(
                    req.body.id,
                    { $set: req.body },
                    { new: true }
                )
                return next(createSuccess(200, 'Your account updated successfully!'));
            }
            else {
                return next(createError(404, 'Your account not found!'));
            }
        }
        else {
            return next(createError(404, 'Your account not found!'));
        }
    } catch (error) {
        return next(createError(500, `Internal server error ${error}`))
    }
}


export const logout = (req, res, next) => {
    try {
        res.clearCookie('access-token');
        return next(createSuccess(200, 'User logged out success'));
    } catch (error) {
        return next(createError(500, 'Something went wrong - ' + error))
    }
}