import axiosInstance from './axiosInstance';
const BASE = '/users';
export const fetchUsersApi  = ()           => axiosInstance.get(BASE);
export const createUserApi  = (data)       => axiosInstance.post(BASE, data);
export const updateUserApi  = (id, data)   => axiosInstance.put(`${BASE}/${id}`, data);
export const deleteUserApi  = (id)         => axiosInstance.delete(`${BASE}/${id}`);