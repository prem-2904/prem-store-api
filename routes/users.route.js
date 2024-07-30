import express from 'express';
import { createUserAccount, logout, updateUser, validateUser } from '../controllers/users.controller.js';

const userRouter = express.Router();

userRouter.post('/createAccount', createUserAccount);

userRouter.post('/validateUser', validateUser);

userRouter.post('/updateUser', updateUser);

userRouter.post('/logout', logout);

export default userRouter;