import { InvoiceFullJoin } from "@/types/api";
import { axiosInstance, reqConfig } from "../axios";
import axios from "axios";
import { InvoiceStatus } from "@/utils/constants";

const invoiceApis = {
  getInvoices: async (params: {
    status?: InvoiceStatus;
    limit?: number;
    date?: Date;
  }): Promise<InvoiceFullJoin[]> => {
    let queryString: string = `/invoices?`;
    if (params.status) queryString = queryString + `status=${params.status}`;
    if (params.date) {
      if (params.status) {
        queryString = queryString + "&";
      }
      queryString = queryString + `date=${params.date}`;
    }
    if (params.limit) {
      if (params.status || params.date) {
        queryString = queryString + "&";
      }
      queryString = queryString + `limit=${params.limit}`;
    }

    try {
      const response = await axiosInstance.get<{ info: InvoiceFullJoin[] }>(
        queryString,
        reqConfig
      );

      return response.data.info;
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
      return [];
    }
  },
};

export default invoiceApis;
