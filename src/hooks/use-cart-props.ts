import { CartContext } from "@/context";
import { useContext } from "react";

const useCartProps = () => {
  const { itemsInLocal, setItemsInLocal, removeInvoice, phaseID, setPhaseID } =
    useContext(CartContext);
  return { itemsInLocal, setItemsInLocal, removeInvoice, phaseID, setPhaseID };
};

export default useCartProps;
