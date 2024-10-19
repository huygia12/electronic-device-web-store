import { useLocalStorage } from "@/hooks";
import { CartItem } from "@/types/model";
import { ReactNode, createContext, useState } from "react";

export interface CartContextProps {
  itemsInLocal: CartItem[];
  setItemsInLocal: (value: CartItem[]) => void;
  removeInvoice: () => void;
  phaseID: string;
  setPhaseID: (value: string) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [itemsInLocal, setItemsInLocal, removeInvoice] =
    useLocalStorage<CartItem[]>("cart");
  const [phaseID, setPhaseID] = useState<string>("1");

  if (!itemsInLocal) setItemsInLocal([]);

  const value: CartContextProps = {
    itemsInLocal: itemsInLocal ?? [],
    setItemsInLocal,
    removeInvoice,
    phaseID,
    setPhaseID,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartProvider };
export default CartContext;
