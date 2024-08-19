import ordersModel from "../models/orders/orders.model.js";
import orderHistoryModel from "../models/orders/orderHistory.model.js";
import orderItemsModel from "../models/orders/orderItems.model.js";
import dotenv, { populate } from 'dotenv';
import { createError, createSuccess } from "../utils/response-structure.js";
import razorpay from 'razorpay';
import cartModel from "../models/cart.model.js";
import { updateStocksOnOrder } from "./products.controller.js";
import orderStatusModel from "../models/orders/order.status.model.js";

dotenv.config();

const rpInstance = new razorpay({
    key_secret: process.env.KEY_SECRET,
    key_id: process.env.KEY_ID
});


export const createOrder = async (req, res, next) => {
    try {
        if (!req.body) {
            return next(createSuccess(400, 'Bad data request', []));
        }

        const options = {
            "amount": req.body.amount * 100,
            "currency": "INR",
            "receipt": "Prem Store User Purchase " + req.body.receipt,
            "notes": req.body.notes
        };

        await rpInstance.orders.create(options, (err, data) => {
            if (err) {
                return next(createError(500, 'Something went wrong with payment gateway' + err, []))
            }

            return next(createSuccess(201, 'Order created!', data, []));
        })
    } catch (error) {
        return next(createError(500, error, []))
    }
}

export const createTransactionAndOrderDetails = async (req, res, next) => {
    try {
        const lastDataID = await ordersModel.findOne({}, null, { sort: { _id: -1 } });
        let orderId;
        if (!lastDataID) {
            orderId = `ORDER0000001`
        } else {
            const lastCount = parseInt(lastDataID._id.substring(5));
            const nextCount = lastCount + 1;
            const previousID = nextCount.toString().padStart(7, '0');
            orderId = `ORDER${previousID}`;
        }
        // const orderId = `ORDER${previousID}`; //`ORDER0000001`
        const order = req.body;
        const orderDetails = {
            _id: orderId,
            totalAmount: order?.totalAmount,
            typeOfPayment: order?.typeOfPayment,
            paymentOrderId: order?.paymentOrderId,
            paymentTransactionId: order?.paymentTransactionId,
            orderFullName: order?.orderFullName,
            orderAddressLine1: order?.orderAddressLine1,
            orderAddressLine2: order?.orderAddressLine2,
            orderAddressPincode: order?.orderAddressPincode,
            orderEmail: order?.orderEmail,
            orderPhone: order?.orderPhone,
            // orderStatus: order?.orderStatus == 'inperson' ? 'delivered' : "ordered",
            orderStatus: "ordered",
            orderedBy: order?.orderedBy,
            // updatedBy: order?.updatedBy,
            orderAmountPaid: order?.orderAmountPaid,
            orderItems: [],
            orderHistory: [],
            offerDetails: order?.offers
        };
        console.log("order-payload", orderDetails)
        const orderItems = req.body.orderItems;
        const updateOrderItems = {
            orderItems: [],
            orderHistory: []
        };
        for (let i = 0; i < orderItems.length; i++) {
            let itemsPayload = {
                "orderItem": orderItems[i].orderItem,
                "orderedQuantity": orderItems[i].orderedQuantity,
                "orderItemPrice": orderItems[i].orderItemPrice,
                "orderTotal": orderItems[i].orderTotal,
                "orderStatus": req.body.orderStatus == 'inperson' ? 'delivered' : "ordered",
                "orderId": orderId,
                "orderStockId": orderItems[i].itemStockId
            }
            const orderItemsSave = new orderItemsModel(itemsPayload);
            orderDetails.orderItems.push(orderItemsSave);
            await orderItemsSave.save();

            const cartId = await cartModel.findById({ _id: orderItems[i].cartId });
            if (cartId) {
                await cartModel.findByIdAndUpdate(
                    cartId._id,
                    { $set: { isDeleted: true } },
                )
            }
            const inputPayload = {
                stockId: orderItems[i].itemStockId,
                orderedQuantity: orderItems[i].orderedQuantity,
                removeStock: true
            }
            await updateStocksOnOrder(inputPayload);
        }
        //To create records order history
        const historyPayload = {
            orderId: orderId,
            orderStatus: "ordered",
            statusUpdatePlace: "NA"
        };
        const orderHistory = new orderHistoryModel(historyPayload);
        orderDetails.orderHistory.push(orderHistory);
        await orderHistory.save();

        //To create records for order details
        const orders = new ordersModel(orderDetails);
        await orders.save();

        return next(createSuccess(201, 'Order created successfully', orderDetails))
    } catch (error) {
        return next(createError(500, error, []))
    }
}

// Function to generate custom _id
const generateOrderId = async () => {
    const lastOrder = await ordersModel.findOne({}, null, { sort: { _id: -1 } });
    let newId = 'OD00000001';

    if (lastOrder) {
        const lastId = lastOrder._id;
        const lastNum = parseInt(lastId.slice(5), 10);
        const newNum = lastNum + 1;
        newId = `OD${newNum.toString().padStart(8, '0')}`;
    }

    return newId;
}

export const createOrderWithDelivery = async (req, res, next) => {
    try {

        const order = req.body;
        const orderDetails = {
            _id: "",
            totalAmount: order?.totalAmount,
            typeOfPayment: order?.typeOfPayment,
            paymentOrderId: order?.paymentOrderId,
            paymentTransactionId: order?.paymentTransactionId,
            orderFullName: order?.orderFullName,
            orderAddressLine1: order?.orderAddressLine1,
            orderAddressLine2: order?.orderAddressLine2,
            orderAddressPincode: order?.orderAddressPincode,
            orderEmail: order?.orderEmail,
            orderPhone: order?.orderPhone,
            // orderStatus: order?.orderStatus == 'inperson' ? 'delivered' : "ordered",
            orderStatus: "ordered",
            orderedBy: order?.orderedBy,
            orderAmountPaid: order?.orderAmountPaid,
            orderItems: "",
            orderHistory: [],
            offerDetails: order?.offers
        };
        console.log("order-details", orderDetails)
        const orderItems = req.body.orderItems;
        for (let i = 0; i < orderItems.length; i++) {
            let newOrderId = await generateOrderId();

            orderDetails._id = newOrderId;
            let itemsPayload = {
                "orderItem": orderItems[i].orderItem,
                "orderedQuantity": orderItems[i].orderedQuantity,
                "orderItemPrice": orderItems[i].orderItemPrice,
                "orderTotal": orderItems[i].orderTotal,
                "orderStatus": req.body.orderStatus == 'inperson' ? 'delivered' : "ordered",
                "orderId": newOrderId,
                "orderStockId": orderItems[i].itemStockId,
                "sellerId": orderItems[i]?.sellerId
            }
            const orderItemsSave = new orderItemsModel(itemsPayload);
            orderDetails.orderItems = orderItemsSave;
            // await orderItemsSave.save();
            const orders = new ordersModel(orderDetails);
            // await orders.save();

            //To create records order history
            const historyPayload = {
                orderId: newOrderId,
                orderStatus: "ordered",
                statusUpdatePlace: "NA"
            };
            const orderHistory = new orderHistoryModel(historyPayload);
            orderDetails.orderHistory.push(orderHistory);
            // await orderHistory.save();
            await Promise.all([orderItemsSave.save(), orders.save(), orderHistory.save()]);

            const cartId = await cartModel.findById({ _id: orderItems[i].cartId });
            if (cartId) {
                await cartModel.findByIdAndUpdate(
                    cartId._id,
                    { $set: { isDeleted: true } },
                )
            }
            const inputPayload = {
                stockId: orderItems[i].itemStockId,
                orderedQuantity: orderItems[i].orderedQuantity,
                removeStock: true
            }
            await updateStocksOnOrder(inputPayload);
        }

        return next(createSuccess(201, 'Order created successfully', orderDetails))
    } catch (error) {
        return next(createError(500, error, []))
    }
}

export const getUsersOrder = async (req, res, next) => {
    try {
        const orders = await ordersModel.find({ orderedBy: req.params.id })
            .populate("orderedBy")
            .populate({
                path: "orderItems",
                model: "order-items", // assuming "order-items" is the model name
                populate: {
                    path: 'orderItem',
                    model: "products",
                }
            })
            .populate({
                path: "orderHistory",
                model: "order-history" // assuming "order-history" is the model name
            })
            .sort({ "_id": -1 });
        return next(createSuccess(200, '', orders))
    } catch (error) {
        return next(createError(500, error))
    }
}

export const getOrderForAdmins = async (req, res, next) => {
    try {
        const orders = await ordersModel.find()
            .populate("orderedBy")
            .populate("orderItems")
            // .populate("updatedBy")
            .populate("orderHistory")
        return next(createSuccess(200, '', orders))
    } catch (error) {
        return next(createError(500, error))
    }
}

export const getOrderBasedId = async (req, res, next) => {
    try {
        const orders = await ordersModel.find({ _id: req.body.orderId })
            .populate("orderedBy")
            .populate({ path: "orderItems", populate: { path: "orderItem" } })
            // .populate("updatedBy")
            .populate("orderHistory")
        return next(createSuccess(200, '', orders))
    } catch (error) {
        return next(createError(500, error))
    }
}

export const getOrderIdWithUnitId = async (req, res, next) => {
    try {
        const orders = await ordersModel.findById(req.query.orderId)
            .populate({ path: "orderedBy", select: "fullName email profilePicture" })
            .populate({
                path: "orderItems",
                populate: [
                    { path: "orderItem", select: "productName productDesc productImages", },
                    { path: "orderStatus", select: "statusText statusComments" }
                ]
            })
            .populate({ path: "orderHistory", select: "orderStatus createdAt", populate: { path: "orderStatus", select: "statusText statusComments" } })
        return next(createSuccess(200, '', orders))
    } catch (error) {
        return next(createError(500, error))
    }
}


export const getOrderIdWithUnitIdUpdated = async (req, res, next) => {
    try {
        const orderId = req.query.orderId
        const orderModel = ordersModel.findById(orderId)
            .populate({ path: "orderedBy", select: "fullName email profilePicture" });
        const itemsModel = orderItemsModel.find({ orderId: orderId })
            .populate([
                { path: "orderItem", select: "productName productDesc productImages", },
                { path: "orderStatus", select: "statusText statusComments statusOrder" }
            ]);
        const historyModel = orderHistoryModel.find({ orderId: orderId }).select("statusUpdatePlace createdAt orderStatus")
            .populate({ path: "orderStatus", select: "statusText statusComments statusOrder" });
        const statusModel = displayAllOrderStatus(false);

        const [orderData, updateOrderItems, orderHistory, orderStatuses] = await Promise.all([orderModel, itemsModel, historyModel, statusModel]);
        // (orderData, updateOrderItems, orderHistory, orderStatuses);
        let orderUpdatedStatus = [];
        let currentOrderStatus = updateOrderItems[0].orderStatus;
        orderStatuses.forEach(status => {
            let isCompletedStatus = orderHistory.findIndex((h) => h.orderStatus._id === status._id);
            if (isCompletedStatus >= 0) {
                orderUpdatedStatus.push({ status, isCompletedStatus: true, history: orderHistory[isCompletedStatus] })
            }
            else if (status.statusOrder <= 6 && currentOrderStatus._id !== "cancelled") {
                orderUpdatedStatus.push({ status, isCompletedStatus: false })
            }
            else if (status._id !== "cancelled" && status.statusOrder > 6 && currentOrderStatus.statusOrder > 6) {
                orderUpdatedStatus.push({ status, isCompletedStatus: false })
            }
            else if (currentOrderStatus._id === "cancelled" && status._id === "cancelled") {
                orderUpdatedStatus.push({ status, isCompletedStatus: false })
            }
        });
        const orderedItem = updateOrderItems[0];

        return next(createSuccess(200, '', { orderData, orderedItem, updatedOrderStatus: orderUpdatedStatus }))
    } catch (error) {
        console.log("Error", error)
        return next(createError(500, error))
    }
}

const displayAllOrderStatus = async (isReturnedOrder) => {
    const orderStatus = await orderStatusModel.find({}, null, { sort: { statusOrder: 1 } }).select("statusComments statusText returnStatus statusOrder");
    return orderStatus;
}

export const getOrdersOverview = async (req, res, next) => {
    try {
        let orders;
        if (req.query.id) {
            orders = await ordersModel.find({ orderedBy: req.params.id })
                .populate("orderedBy")
            // .populate("updatedBy")
        }
        else {
            orders = await ordersModel.find()
                .populate("orderedBy")
            // .populate("updatedBy")
        }

        return next(createSuccess(200, '', orders))
    } catch (error) {
        return next(createError(500, 'Something went wrong' + error))
    }
}

export const cancelOrder = async (req, res, next) => {
    try {
        const orderId = req.body.orderId;
        if (orderId) {
            const item = await orderItemsModel.updateOne({ orderId: orderId }, { orderStatus: 'cancelled', isCancelled: true });

            const historyPayload = {
                orderId: orderId,
                orderStatus: "cancelled",
                statusUpdatePlace: "Your cancelled order!"
            };
            const orderHistory = new orderHistoryModel(historyPayload);
            await orderHistory.save();
            return next(createSuccess(200, 'Order cancellation request raised!!', item));
        } else {
            return next(createError(403, 'Bad data request, Incorrect payload'));
        }
    } catch (error) {
        return next(createError(500, 'Something went wrong' + error));
    }
}

export const returnOrder = async (req, res, next) => {

}



