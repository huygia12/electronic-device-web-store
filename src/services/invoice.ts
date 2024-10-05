import { CartItem, InvoiceFullJoin } from "@/types/model";
import { axiosInstance, reqConfig } from "@/config/axios-config";
import axios from "axios";
import { InvoiceStatus } from "@/types/enum";
import { OrderInsertion, ProductOrderInsertion } from "@/types/api";

const invoiceService = {
  apis: {
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
    createOrder: async (
      orderPayload: OrderInsertion
    ): Promise<InvoiceFullJoin> => {
      const res = await axiosInstance.post<{ info: InvoiceFullJoin }>(
        "/invoices",
        orderPayload,
        reqConfig
      );

      return res.data.info;
    },
  },
  getTotalBill: (invoice: InvoiceFullJoin): number => {
    return invoice.invoiceProducts.reduce(
      (total, item) =>
        total + item.quantity * (1 - (item.discount || 0)) * item.price,
      0
    );
  },
  getProductOrderInsertion: (
    cartItems: CartItem[]
  ): ProductOrderInsertion[] => {
    return cartItems.map((item) => ({
      productID: item.productID,
      itemID: item.itemID,
      quantity: item.quantity,
    }));
  },
};

export default invoiceService;
