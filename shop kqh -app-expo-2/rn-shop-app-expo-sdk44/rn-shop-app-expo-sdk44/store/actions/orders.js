import Order from "../../models/order";
import config from "../../config";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";
export const DELETE_ORDER = "DELETE_ORDER";
export const UPDATE_ORDER_STATUS = "UPDATE_ORDER_STATUS";

export const deleteOrder = (orderId) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(
            `${config.DATABASE_URL}/orders/${userId}/${orderId}.json?auth=${token}`,
            {
                method: "DELETE",
            }
        );
        if (!response.ok) {
            throw new Error("Lỗi khi xóa đơn hàng!");
        }
        dispatch({ type: DELETE_ORDER, orderId });
    };
};

export const fetchOrders = () => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        try {
            const response = await fetch(
                `${config.DATABASE_URL}/orders/${userId}.json?auth=${token}`
            );
            if (!response.ok) {
                const errorResData = await response.text();
                throw new Error(`HTTP Error ${response.status}: ${errorResData}`);
            }
            const resData = await response.json();
            const loadedOrders = [];

            for (const key in resData) {
                loadedOrders.push(
                    new Order(
                        key,
                        resData[key].cartItems,
                        resData[key].totalAmount,
                        new Date(resData[key].date),
                        resData[key].address,
                        resData[key].paymentMethod,
                        resData[key].status
                    )
                );
            }
            dispatch({
                type: SET_ORDERS,
                orders: loadedOrders,
            });
        } catch (error) {
            throw error;
        }
    };
};

export const addOrder = (cartItems, totalAmount, address, paymentMethod) => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const date = new Date();
        const status = 'warehouse';
        const response = await fetch(
            `${config.DATABASE_URL}/orders/${userId}.json?auth=${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cartItems,
                    totalAmount,
                    date: date.toISOString(),
                    address,
                    paymentMethod,
                    status,
                }),
            }
        );
        if (!response.ok) {
            const errorResData = await response.text();
            throw new Error(`HTTP Error ${response.status}: ${errorResData}`);
        }

        const resData = await response.json();

        dispatch({
            type: ADD_ORDER,
            orderData: {
                id: resData.name,
                items: cartItems,
                amount: totalAmount,
                date: date,
                address,
                paymentMethod,
                status,
            },
        });
    };
};

// Admin only: fetch all orders from all users
export const fetchAllOrders = () => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;
        try {
            const response = await fetch(
                `${config.DATABASE_URL}/orders.json?auth=${token}`
            );
            if (!response.ok) {
                const errorResData = await response.text();
                throw new Error(`HTTP Error ${response.status}: ${errorResData}`);
            }
            const resData = await response.json();
            const loadedOrders = [];

            for (const userId in resData) {
                for (const orderId in resData[userId]) {
                    loadedOrders.push({
                        ...new Order(
                            orderId,
                            resData[userId][orderId].cartItems,
                            resData[userId][orderId].totalAmount,
                            new Date(resData[userId][orderId].date),
                            resData[userId][orderId].address,
                            resData[userId][orderId].paymentMethod,
                            resData[userId][orderId].status
                        ),
                        userId,
                    });
                }
            }
            // Sort by date descending
            loadedOrders.sort((a, b) => b.date - a.date);
            dispatch({
                type: SET_ORDERS,
                orders: loadedOrders,
            });
        } catch (error) {
            throw error;
        }
    };
};

// Admin only: update order status
export const updateOrderStatus = (userId, orderId, newStatus) => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(
            `${config.DATABASE_URL}/orders/${userId}/${orderId}.json?auth=${token}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            }
        );
        if (!response.ok) {
            throw new Error("Lỗi khi cập nhật trạng thái đơn hàng!");
        }
        dispatch({
            type: UPDATE_ORDER_STATUS,
            orderId,
            status: newStatus,
        });
    };
};