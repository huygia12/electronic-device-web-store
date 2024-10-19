import { CartContext } from "@/context";
import { useContext } from "react";

const useCartProps = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("useCartProps must be used within a <CartProvider />");
  }

  return cartContext;
};

export default useCartProps;
