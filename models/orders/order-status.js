export const ORDERSTATUS = [
    {
        _id: "ordered",
        statusText: "Ordered",
        statusOrder: 1,
        statusComments: "Order placed!",
        isSellerAction: true,
        isWarehouseAction: false,
        isDeliveryPersonAction: false,
        isUserAction: false
    },
    {
        _id: "dispatched",
        statusText: "Ordered",
        statusOrder: 2,
        statusComments: "Your item has been picked up by courier partner",
        isSellerAction: true,
        isWarehouseAction: false,
        isDeliveryPersonAction: false,
        isUserAction: false
    },
    {
        _id: "shipped",
        statusText: "Shipped",
        statusOrder: 3,
        statusComments: "Your item has been shipped",
        isSellerAction: true,
        isWarehouseAction: false,
        isDeliveryPersonAction: false,
        isUserAction: false
    },
    {
        _id: "in-transit",
        statusText: "In-Transit",
        statusOrder: 4,
        statusComments: "Your item in In-transit",
        isSellerAction: false,
        isWarehouseAction: true,
        isDeliveryPersonAction: false,
        isUserAction: false
    },
    {
        _id: "outfordelivery",
        statusText: "Out for Delivery",
        statusOrder: 5,
        statusComments: "Your order Out for Delivery",
        isSellerAction: false,
        isWarehouseAction: true,
        isDeliveryPersonAction: false,
        isUserAction: false
    },
    {
        _id: "delivered",
        statusText: "Delivered",
        statusOrder: 6,
        statusComments: "Order Delivered",
        isSellerAction: false,
        isWarehouseAction: false,
        isDeliveryPersonAction: true,
        isUserAction: false
    },
    {
        _id: "returninitiated",
        statusText: "Return Initiated",
        statusOrder: 7,
        returnStatus: true,
        statusComments: "Return order placed & Pick-up scheduled",
        isSellerAction: false,
        isWarehouseAction: false,
        isDeliveryPersonAction: false,
        isUserAction: true
    },
    {
        _id: "returned",
        statusText: "Returned & Refund Initiated",
        statusOrder: 8,
        returnStatus: true,
        statusComments: "Item picked up & refund initiated!",
        isSellerAction: false,
        isWarehouseAction: false,
        isDeliveryPersonAction: true,
        isUserAction: false
    },
    {
        _id: "refunded",
        statusText: "Refund Completed",
        statusOrder: 9,
        returnStatus: true,
        statusComments: "Refund completed",
        isSellerAction: false,
        isWarehouseAction: true,
        isDeliveryPersonAction: false,
        isUserAction: false
    },

];


export const cancelOrder = [
    {
        _id: "cancelled",
        statusText: "Cancelled",
        statusOrder: 0,
        returnStatus: false,
        statusComments: "Order Cancelled",
        isSellerAction: false,
        isWarehouseAction: true,
        isDeliveryPersonAction: false,
        isUserAction: true
    },
]