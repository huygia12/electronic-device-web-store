import { InvoiceContext } from "@/context";
import { useContext } from "react";

const useMyInvoice = () => {
  const invoiceContext = useContext(InvoiceContext);

  if (!invoiceContext) {
    throw new Error(
      "useInvoiceContext must be used within a <InvoiceProvider />"
    );
  }

  return invoiceContext;
};

export default useMyInvoice;
