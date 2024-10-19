import { ReactNode, createContext, useState } from "react";

export interface InvoiceContextProps {
  numberOfShippingInvoice: number;
  setNumberOfShippingInvoice: (value: number) => void;
}

const InvoiceContext = createContext<InvoiceContextProps | undefined>(
  undefined
);

const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quantity, setQuantity] = useState<number>(0);

  const value: InvoiceContextProps = {
    numberOfShippingInvoice: quantity,
    setNumberOfShippingInvoice: setQuantity,
  };

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
};

export { InvoiceProvider };
export default InvoiceContext;
