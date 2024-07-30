import express from 'express';
import { cancelOrder, createOrder, createOrderWithDelivery, createTransactionAndOrderDetails, getOrderBasedId, getOrderForAdmins, getOrderIdWithUnitId, getOrderIdWithUnitIdUpdated, getOrdersOverview, getUsersOrder } from '../controllers/orders.controller.js';
import { getSellerOrders, updateOrderStatus } from '../controllers/seller-orders.controller.js';
const orderRoutes = express.Router();

orderRoutes.post("/createPaymentOrder", createOrder);

// orderRoutes.post("/createOrderAndTransaction", createTransactionAndOrderDetails);

orderRoutes.post("/createOrderAndTransaction", createOrderWithDelivery); //new process

orderRoutes.get("/getUsersOrder/:id", getUsersOrder);

orderRoutes.get("/getOrdersForAdmin", getOrderForAdmins);

orderRoutes.put("/updateOrder", updateOrderStatus);

orderRoutes.get("/getOrdersoverview", getOrdersOverview);

orderRoutes.post("/getOrderById", getOrderBasedId);

orderRoutes.get('/v2/getOrderIdWithUnit', getOrderIdWithUnitIdUpdated);

orderRoutes.get('/getOrderIdWithUnit', getOrderIdWithUnitId);

orderRoutes.get("/getSellerOrders/:sellerId", getSellerOrders);

orderRoutes.put('/cancelOrder', cancelOrder);

export default orderRoutes;