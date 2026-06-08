import axiosInstance from "./axiosInstance";
const BASE = "/repairs";
export const fetchRepairsApi = (params) => axiosInstance.get(BASE, { params });
export const fetchRepairByIdApi = (id) => axiosInstance.get(`${BASE}/${id}`);
export const createRepairApi = (data) => axiosInstance.post(BASE, data);
export const updateRepairApi = (id, data) =>
  axiosInstance.put(`${BASE}/${id}`, data);
export const updateStatusApi = (id, data) =>
  axiosInstance.patch(`${BASE}/${id}/status`, data);
export const deleteRepairApi = (id) => axiosInstance.delete(`${BASE}/${id}`);
