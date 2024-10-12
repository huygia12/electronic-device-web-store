import { useCartProps } from "@/hooks";
import { Bill, EditableCartTable } from "@/components/cart-vistiting";
import { FC, useEffect } from "react";

const CartVisting: FC = () => {
  const { setPhaseID } = useCartProps();

  useEffect(() => {
    setPhaseID("1");
  }, [setPhaseID]);
  return (
    <div className="grid grid-cols-4 w-full gap-4">
      <EditableCartTable className="p-4" />

      <Bill />
    </div>
  );
};

export default CartVisting;
