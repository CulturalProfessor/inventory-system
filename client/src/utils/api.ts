import axios from "axios";

const environment = process.env.NODE_ENV;

const getApiUrl = () => {
  if (environment === "development") {
    return "http://localhost:3001";
  }
  return "https://api.example.com";
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

interface CustomError {
  message: string;
  status?: number; 
  data?: unknown;
}

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
}) => {
  return apiPost("/register", data);
};

export const addNewProduct = async (data: {
  name: string;
  price: number;
  description: string;
}) => {
  return apiPost("/product/add", data);
};

export const fetchProducts = async () => {
  return apiGet("/product");
};

export const updateProduct = async (data: {
  id: string;
  name?: string;
  price?: number;
  description?: string;
}) => {
  return apiPost("/product/update", data);
};

export const deleteProduct = async (data: { id: string }) => {
  return apiDelete("/product/delete", { data });
};

export const predictProduct = async (data: { id: string }) => {
  return apiPost("/product/predict", data);
};
