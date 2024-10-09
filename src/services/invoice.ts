import { CartItem, InvoiceFullJoin } from "@/types/model";
import { axiosInstance, reqConfig } from "@/config/axios-config";
import axios from "axios";
import { InvoiceStatus, PaymentMethod } from "@/types/enum";
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
  getInvoicePaymentMethod: (method: PaymentMethod): string => {
    let paymentMethod: string;
    if (method === PaymentMethod.BANKING)
      paymentMethod = "Thanh Toán Bằng Chuyển Khoản";
    else if (method === PaymentMethod.COD)
      paymentMethod = "Thanh Toán Khi Nhận Hàng";
    else paymentMethod = "Chưa Thanh Toán";

    return paymentMethod;
  },
  getInvoiceStatus: (status: InvoiceStatus): string => {
    let invoiceStatus: string;
    if (status === InvoiceStatus.NEW) invoiceStatus = "Đang Chờ Duyệt";
    else if (status === InvoiceStatus.PAYMENT_WATING)
      invoiceStatus = "Đang Chờ Thanh Toán";
    else if (status === InvoiceStatus.SHIPPING)
      invoiceStatus = "Đang Giao Hàng";
    else if (status === InvoiceStatus.DONE)
      invoiceStatus = "Giao Hàng Thành Công";
    else invoiceStatus = "Đã Bị Hủy";

    return invoiceStatus;
  },
  getInvoiceStatusLevel: (invoiceStatus: InvoiceStatus): number => {
    return invoiceStatus === InvoiceStatus.NEW
      ? 1
      : invoiceStatus === InvoiceStatus.PAYMENT_WATING
        ? 2
        : invoiceStatus === InvoiceStatus.SHIPPING
          ? 3
          : invoiceStatus === InvoiceStatus.DONE
            ? 4
            : 5;
  },
  getInvoiceStatusDisabled: (
    statusToCompare: InvoiceStatus,
    currentStatus: InvoiceStatus
  ) => {
    if ([InvoiceStatus.ABORT, InvoiceStatus.DONE].includes(currentStatus)) {
      // When currentStatus has already been to DONE or ABORT, it cannot change the status anyfurther
      return true;
    } else if (currentStatus === InvoiceStatus.SHIPPING) {
      // When currentStatus has already been to shipping, it can only turn into DONE status
      return statusToCompare !== InvoiceStatus.DONE;
    }

    return (
      invoiceService.getInvoiceStatusLevel(currentStatus) >
      invoiceService.getInvoiceStatusLevel(statusToCompare)
    );
  },
};

export default invoiceService;
