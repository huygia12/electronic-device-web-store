import { CartItem, Invoice } from "@/types/model";
import { axiosInstance } from "@/config/axios-config";
import { InvoiceStatus, PaymentMethod } from "@/types/enum";
import {
  InvoiceInsertionPayload,
  ProductInvoiceInsertionPayload,
} from "@/types/payload";
import { Args } from "@/utils/helpers";

const invoiceEndPoint = "/invoices";

const invoiceService = {
  apis: {
    getMyInvoices: async (
      args: Args | string
    ): Promise<{ invoices: Invoice[]; totalInvoices: number }> => {
      let userID: string;
      if (typeof args === "string") {
        userID = args;
      } else {
        userID = args.params.id!;
      }

      const response = await axiosInstance.get<{
        info: { invoices: Invoice[]; totalInvoices: number };
      }>(`${invoiceEndPoint}?userID=${userID}&status=${InvoiceStatus.NEW}`);

      return response.data.info;
    },
    getInvoice: async (invoiceID: string): Promise<Invoice> => {
      const response = await axiosInstance.get<{
        info: Invoice;
      }>(`${invoiceEndPoint}/${invoiceID}`);

      return response.data.info;
    },
    getInvoices: async (params: {
      status?: InvoiceStatus;
      date?: Date;
      searching?: string;
      currentPage?: number;
      invoiceID?: string;
      userID?: string;
    }): Promise<{ invoices: Invoice[]; totalInvoices: number }> => {
      let path: string = `${invoiceEndPoint}?`;
      path += `status=${params.status || InvoiceStatus.NEW}`;
      params.date && (path += `&date=${params.date}`);
      params.searching && (path += `&searching=${params.searching}`);
      params.currentPage && (path += `&currentPage=${params.currentPage}`);
      params.invoiceID && (path += `&invoiceID=${params.invoiceID}`);
      params.userID && (path += `&userID=${params.userID}`);

      const response = await axiosInstance.get<{
        info: { invoices: Invoice[]; totalInvoices: number };
      }>(path);

      return response.data.info;
    },
    createInvoice: async (
      orderPayload: InvoiceInsertionPayload
    ): Promise<Invoice> => {
      const res = await axiosInstance.post<{ info: Invoice }>(
        `${invoiceEndPoint}`,
        orderPayload
      );

      return res.data.info;
    },
    payInvoice: async (invoiceID: string): Promise<string> => {
      const res = await axiosInstance.patch<{ info: string }>(
        `${invoiceEndPoint}/${invoiceID}/payment`
      );

      return res.data.info;
    },
    upateInvoice: async (
      invoiceID: string,
      params: {
        status?: InvoiceStatus;
        paymentID?: string;
        payment?: PaymentMethod;
      }
    ): Promise<Invoice> => {
      const res = await axiosInstance.patch<{ info: Invoice }>(
        `${invoiceEndPoint}/${invoiceID}`,
        {
          status: params.status,
          paymentID: params.paymentID,
          payment: params.payment,
        }
      );

      return res.data.info;
    },
  },
  getTotalBill: (invoice: Invoice): number => {
    return invoice.invoiceProducts.reduce(
      (total, item) =>
        total + item.quantity * (1 - (item.discount || 0) / 100) * item.price,
      0
    );
  },
  getProductOrderInsertion: (
    cartItems: CartItem[]
  ): ProductInvoiceInsertionPayload[] => {
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
    else if (status === InvoiceStatus.PAYMENT_WAITING)
      invoiceStatus = "Đang Chờ Thanh Toán";
    else if (status === InvoiceStatus.SHIPPING)
      invoiceStatus = "Đang Giao Hàng";
    else if (status === InvoiceStatus.DONE)
      invoiceStatus = "Giao Hàng Thành Công";
    else invoiceStatus = "Đã Bị Hủy";

    return invoiceStatus;
  },
  getInvoiceStatusColor: (status: InvoiceStatus): string => {
    let color: string;
    if (status === InvoiceStatus.NEW) color = "bg-gray-500";
    else if (status === InvoiceStatus.PAYMENT_WAITING) color = "bg-green-500";
    else if (status === InvoiceStatus.SHIPPING) color = "bg-orange-500";
    else if (status === InvoiceStatus.DONE) color = "bg-blue-500";
    else color = "bg-red-500";

    return color;
  },
  getInvoiceStatusLevel: (invoiceStatus: InvoiceStatus): number => {
    return invoiceStatus === InvoiceStatus.NEW
      ? 1
      : invoiceStatus === InvoiceStatus.PAYMENT_WAITING
        ? 2
        : invoiceStatus === InvoiceStatus.SHIPPING
          ? 3
          : invoiceStatus === InvoiceStatus.DONE
            ? 4
            : 5;
  },
  getUserButtonDisabled: (
    buttonType: "accept" | "cancel",
    currentStatus: InvoiceStatus
  ) => {
    if (buttonType === "accept") {
      return ![InvoiceStatus.PAYMENT_WAITING].includes(currentStatus);
    } else {
      return ![InvoiceStatus.PAYMENT_WAITING, InvoiceStatus.NEW].includes(
        currentStatus
      );
    }
  },
  getAdminInvoiceStatusDisabled: (
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
  updateInvoices: (invoice: Invoice, invoices: Invoice[]): Invoice[] => {
    return [
      invoice,
      ...invoices.filter((e) => e.invoiceID !== invoice.invoiceID),
    ];
  },
  deleteInvoice: (invoiceID: string, invoices: Invoice[]): Invoice[] => {
    return [...invoices.filter((e) => e.invoiceID !== invoiceID)];
  },
  getInvoiceAfterFilterStatus: (
    invoices: Invoice[],
    status: InvoiceStatus
  ): Invoice[] => {
    return invoices.filter((e) => e.status === status);
  },
};

export default invoiceService;
