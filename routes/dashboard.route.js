import express from 'express';
import { dashboardStats, orderStats } from '../controllers/dashboard.controller.js';
const dashboardRoutes = express.Router();

dashboardRoutes.get('/dashboardStats/:sellerId', dashboardStats);

dashboardRoutes.get('/orderStats/:sellerId', orderStats);

export default dashboardRoutes;