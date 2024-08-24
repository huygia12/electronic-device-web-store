import { Nullable } from "@/utils/declare";
import { Invoice } from "@/types/api";
import axios from "axios";
import { axiosInstance } from "../axios";

const orderApis = {
  getOrders: async (): Promise<Invoice[] | undefined> => {
    try {
      const res = await axiosInstance.get<Invoice[]>("/invoices");
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // AxiosError-specific handling
        console.error("Axios error:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
      } else {
        // General error handling
        console.error("Unexpected error:", error);
      }
    }
  },
  makeOrder: async (): Promise<Nullable<string>> => {
    try {
      const res = await axiosInstance.post("/invoices");

      return res.data.info.order_url;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // AxiosError-specific handling
        console.error("Axios error:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
      } else {
        // General error handling
        console.error("Unexpected error:", error);
      }
      return null;
    }
  },
};

export default orderApis;
