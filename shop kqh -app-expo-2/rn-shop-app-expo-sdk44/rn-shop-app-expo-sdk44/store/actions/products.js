import Product from "../../models/product";
import config from "../../config";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        const token = getState().auth.token;
        const response = await fetch(
            `${config.DATABASE_URL}/products.json?auth=${token}`
        );
        if (!response.ok) {
            const errorResData = await response.text();
            throw new Error(`HTTP Error ${response.status}: ${errorResData}`);
        }
        const resData = await response.json();
        const loadedProducts = [];

        for (const key in resData) {
            loadedProducts.push(
                new Product(
                    key,
                    resData[key].ownerId,
                    resData[key].title,
                    resData[key].imageUrl,
                    resData[key].description,
                    resData[key].price,
                    resData[key].category || 'laptop'
                )
            );
        }

        dispatch({
            type: SET_PRODUCTS,
            products: loadedProducts,
            userProducts: loadedProducts.filter(
                (prod) => prod.ownerId === userId
            ),
        });
    };
};

export const deleteProduct = (productId) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        await fetch(
            `${config.DATABASE_URL}/products/${productId}.json?auth=${token}`,
            {
                method: "DELETE",
            }
        );
        dispatch({ type: DELETE_PRODUCT, pId: productId });
    };
};

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(
            `${config.DATABASE_URL}/products.json?auth=${token}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    imageUrl,
                    price,
                    ownerId: userId,
                }),
            }
        );

        const resData = await response.json();
        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                id: resData.name,
                title,
                description,
                imageUrl,
                price,
                ownerId: userId,
            },
        });
    };
};

export const updateProduct = (id, title, description, imageUrl) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        await fetch(
            `${config.DATABASE_URL}/products/${id}.json?auth=${token}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    imageUrl,
                }),
            }
        );

        dispatch({
            type: UPDATE_PRODUCT,
            pId: id,
            productData: {
                title,
                description,
                imageUrl,
                // price
            },
        });
    };
};
