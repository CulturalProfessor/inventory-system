import axios from "axios";
import { User, CustomError, ProductToPredict } from "./commonTypes";

const getApiUrl = () => {
  return "http://localhost:3001";
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const removeAuthToken = () => {
  localStorage.removeItem("token");
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
    "Content-Type": "application/json",
  },
});

const token = getAuthToken();
if (token) {
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
}
api.defaults.headers["Content-Type"] = "application/json";

export const setUserLocal = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUserLocal = (): User | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem("user");
};

export const setAuthHeader = () => {
  const token = getAuthToken();
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
};

// Handle errors from API calls
const handleError = (error: unknown): CustomError => {
  const customError: CustomError = {
    message: "An unexpected error occurred",
  };

  if (axios.isAxiosError(error)) {
    customError.message = error.response?.data?.message || error.message;
    customError.status = error.response?.status;
    customError.data = error.response?.data;
  } else if (error instanceof Error) {
    customError.message = error.message;
  }

  console.error("API Error:", customError);
  throw customError; // Throw the custom error for further handling
};

// API methods
export const apiGet = async (endpoint: string, config = {}) => {
  try {
    const response = await api.get(endpoint, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const apiPost = async (endpoint: string, data: unknown, config = {}) => {
  try {
    const response = await api.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const apiPut = async (endpoint: string, data: unknown, config = {}) => {
  try {
    const response = await api.put(endpoint, data, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const apiDelete = async (endpoint: string, config = {}) => {
  try {
    const response = await api.delete(endpoint, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Example API functions
export const fetchUsers = async () => {
  return apiGet("/users");
};

export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  return apiPost("/login", data);
};

export const registerUser = async (data: {
  username: string;
  password: string;
  email: string;
  image: string;
}) => {
  return apiPost("/register", data);
};

export const addNewProduct = async (data: {
  store: number;
  dept: number;
  size: number;
  type: number;
}) => {
  return apiPost("/product/add", data);
};

export const addBulkProductsWithCSV = async (data: FormData) => {
  return apiPost("/product/addBulk", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fetchProducts = async () => {
  return apiGet("/product");
};

export const updateProduct = async (data: {
  _id: string;
  store?: number;
  dept?: number;
  size?: number;
}) => {
  return apiPost("/product/update", data);
};

export const deleteProduct = async (data: { _id: string }) => {
  return apiDelete("/product/delete", { data });
};

export const predictProduct = async (data: ProductToPredict[]) => {
  return apiPost("/product/predict", data);
};

export const uploadCSV = async (data: FormData) => {
  return apiPost("/product/uploadData", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
