import { useLocalStorage } from "@/hooks";
import { LocalStorageProductItem } from "@/types/api";
import { ReactNode, createContext, useState } from "react";

export interface CartContextProps {
  itemsInLocal: LocalStorageProductItem[];
  setItemsInLocal: (value: LocalStorageProductItem[]) => void;
  removeInvoice: () => void;
  phaseID: string;
  setPhaseID: (value: string) => void;
}

const CartContext = createContext<CartContextProps>({
  itemsInLocal: [],
  setItemsInLocal: () => {},
  removeInvoice: () => {},
  phaseID: "",
  setPhaseID: () => {},
});

const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [itemsInLocal, setItemsInLocal, removeInvoice] = useLocalStorage<
    LocalStorageProductItem[]
  >("cart", []);
  const [phaseID, setPhaseID] = useState("1");

  const value: CartContextProps = {
    itemsInLocal,
    setItemsInLocal,
    removeInvoice,
    phaseID,
    setPhaseID,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartProvider };
export default CartContext;
