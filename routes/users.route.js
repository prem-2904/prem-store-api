import express from 'express';
import { createUserAccount, googleAuthLogin, logout, updateUser, validateUser } from '../controllers/users.controller.js';

const userRouter = express.Router();

userRouter.post('/createAccount', createUserAccount);

userRouter.post('/validateUser', validateUser);

userRouter.post('/updateUser', updateUser);

userRouter.get('/logout', logout);

userRouter.post('/createGoogleUserAccount', googleAuthLogin);

export default userRouter;