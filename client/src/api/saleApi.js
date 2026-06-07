import axiosInstance from "./axiosInstance";
export const createSaleApi = (data) => axiosInstance.post("/sales", data);
export const getSalesApi = (params) => axiosInstance.get("/sales", { params });
export const getSaleByIdApi = (id) => axiosInstance.get(`/sales/${id}`);
export const refundSaleApi = (id) => axiosInstance.post(`/sales/${id}/refund`);
