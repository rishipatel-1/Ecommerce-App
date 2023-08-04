
import axios from "axios";
import jwtDecode from "jwt-decode";

let UserId;
let isAdmin = false;

const BASE_URL = "http://localhost:5000";
const api = axios.create({
  baseURL: BASE_URL,
});

export const setTokens = (token, user) => {
    api.defaults.headers.common["Authorization"] = `${token}`;
    UserId = user?.id;
    
    const decodedToken = jwtDecode(token);
    isAdmin = decodedToken.role === "admin";
    
  };

  export const loginUser = async (user) => {
    try {
      const response = await api.post(`/login`, user);
      return response.data;
    } catch (error) {
      throw new Error("Failed to login");
    }
  };
  
  export const registerUser = async (user) => {
    try {
      const response = await api.post(`/register`, user);
      return response.data;
    } catch (error) {
      if (error.response) {
        const customError = new Error(
          `Failed to register. Status code: ${error.response.status}`
        );
        customError.statusCode = error.response.status;
        throw customError;
      } else {
        throw error;
      }
    }
  };

export const fetchProducts = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post("/admin/products", productData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create product");
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/admin/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete product");
  }
};


export const fetchCart = async () => {
  try {
    const response = await api.get(`/cart`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch cart");
  }
};

export const addToCart = async (productId, quantity) => {
  try {
    
    const response = await api.post(`/carts/add`, {
      productId: productId,
      quantity: quantity,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to add to cart");
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to remove from cart");
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete(`/carts/${UserId}/clear`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to clear cart");
  }
};
