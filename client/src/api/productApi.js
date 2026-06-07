import axiosInstance from "./axiosInstance";

const BASE = "/products";

export const fetchProductsApi = (params) => axiosInstance.get(BASE, { params });
export const fetchProductByIdApi = (id) => axiosInstance.get(`${BASE}/${id}`);
export const createProductApi = (data) => axiosInstance.post(BASE, data);
export const updateProductApi = (id, data) =>
  axiosInstance.put(`${BASE}/${id}`, data);
export const deleteProductApi = (id) => axiosInstance.delete(`${BASE}/${id}`);
export const adjustStockApi = (id, data) =>
  axiosInstance.patch(`${BASE}/${id}/stock`, data);
