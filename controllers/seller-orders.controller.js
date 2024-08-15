import { ORDERSTATUS } from "../models/orders/order-status.js";
import orderStatusModel from "../models/orders/order.status.model.js";
import orderHistoryModel from "../models/orders/orderHistory.model.js";
import orderItemsModel from "../models/orders/orderItems.model.js";
import ordersModel from "../models/orders/orders.model.js";
import { createError, createSuccess } from "../utils/response-structure.js";

export const getSellerOrders = async (req, res, next) => {
    try {
        const sellerId = req.params.sellerId;

        const orders = await orderItemsModel.find({ sellerId: sellerId })
            .populate({ path: "orderId", populate: { path: "orderHistory" } })
            .populate({ path: "orderItem", select: "productName productDesc productImages" })
            .populate({ path: "orderStockId", select: "discount mrpPrice" })
            .populate({ path: "orderStatus", select: "statusText statusComments isSellerAction" })
            .sort({ "orderStatus.isSellerAction": 1, updatedAt: -1 })

        return next(createSuccess(200, '', orders))
    } catch (error) {
        return next(createError(500, 'Something went wrong' + error))
    }
}

export const nextOrderStatus = async (statusId) => {
    try {
        const currentOrder = await orderStatusModel.findById(statusId);
        const nextStatus = await orderStatusModel.find({ statusOrder: currentOrder.statusOrder + 1 });
        return nextStatus?.[0];
    } catch (error) {
        return error;
    }
}

export const updateOrderStatus = async (req, res, next) => {
    try {
        const orderId = req.body.orderId;
        const currentOrder = await orderItemsModel.find({ orderId: orderId });
        const updateOrderStatus = await nextOrderStatus(currentOrder[0].orderStatus);
        const payload = {
            "id": orderId,
            "orderHistory": {
                "nextStatus": updateOrderStatus._id,
                "statusUpdatePlace": updateOrderStatus.statusComments
            },
            "order": {
                "orderStatus": updateOrderStatus._id,
                "orderAmountPaid": req.body?.orderAmountPaid
            }
        }
        const itemPayload = {};
        itemPayload['ordetStatus'] = payload.order.orderStatus;
        if (updateOrderStatus._id === 'delivered') {
            itemPayload['isOrderCompleted'] = true;
        } else if (updateOrderStatus._id === 'refunded') {
            itemPayload['isReturned'] = true;
        } else if (updateOrderStatus._id === 'cancelled') {
            itemPayload['isCancelled'] = true;
        }
        const itemsUpdateRes = await orderItemsModel.updateOne({ orderId: payload.id }, itemPayload);
        const historyPayload = {
            orderId: payload.id,
            orderStatus: payload.orderHistory.nextStatus,
            statusUpdatePlace: payload.orderHistory.statusUpdatePlace
        };
        const orderHistory = new orderHistoryModel(historyPayload);

        let ordersRes = await ordersModel.findById(orderId);
        if (ordersRes) {
            ordersRes.orderHistory.push(orderHistory);
        }
        const orderHistoryRes = await orderHistory.save();
        await ordersRes.save();
        return next(createSuccess(200, `#${orderId} moved to ${updateOrderStatus.statusText}`, { ordersRes, itemsUpdateRes, orderHistoryRes }));
    } catch (error) {
        console.log("error-status", error)
        return next(createError(500, error))
    }
}