import axiosInstance from "./axiosInstance";
export const fetchSummaryApi = (params) =>
  axiosInstance.get("/finance/summary", { params });
export const fetchDailyRevenueApi = (params) =>
  axiosInstance.get("/finance/daily", { params });
export const fetchPaymentBreakdownApi = () =>
  axiosInstance.get("/finance/payment-breakdown");
export const fetchDashboardKPIsApi = () =>
  axiosInstance.get("/finance/dashboard-kpis");
export const fetchOperatorKPIsApi = () => axiosInstance.get("/sales/my-kpis");
