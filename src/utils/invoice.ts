import { InvoiceFullJoin } from "@/types/api";

const invoiceService = {
  getTotalBill: (invoice: InvoiceFullJoin): number => {
    return invoice.invoiceProducts.reduce(
      (total, item) =>
        total + item.quantity * (1 - (item.discount || 0)) * item.price,
      0
    );
  },
};

export default invoiceService;
