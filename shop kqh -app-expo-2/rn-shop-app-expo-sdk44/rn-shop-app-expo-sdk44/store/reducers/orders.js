import { ADD_ORDER, SET_ORDERS, DELETE_ORDER, UPDATE_ORDER_STATUS } from "../actions/orders";
import Order from "../../models/order";

const initialState = { orders: [] };

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_ORDERS:
            return {
                orders: action.orders,
            };
        case ADD_ORDER:
            const newOrder = new Order(
                action.orderData.id,
                action.orderData.items,
                action.orderData.amount,
                action.orderData.date,
                action.orderData.address,
                action.orderData.paymentMethod,
                action.orderData.status
            );
            return {...state, orders: state.orders.concat(newOrder) };
        case DELETE_ORDER:
            return {
                ...state,
                orders: state.orders.filter(order => order.id !== action.orderId)
            };
        case UPDATE_ORDER_STATUS:
            return {
                ...state,
                orders: state.orders.map(order =>
                    order.id === action.orderId
                        ? { ...order, status: action.status }
                        : order
                ),
            };
        default:
            return state;
    }
};