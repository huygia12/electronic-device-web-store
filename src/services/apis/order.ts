import { Invoice } from "@/types/api";
import axios from "axios";
import { axiosInstance } from "../axios";

const getOrders = async (): Promise<Invoice[] | undefined> => {
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
};

export { getOrders };
