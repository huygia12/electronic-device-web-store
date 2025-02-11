import { useCartProps } from "@/hooks";
import { Bill, EditableCartTable } from "@/components/cart-vistiting";
import { FC, useEffect } from "react";

const CartVisting: FC = () => {
  const { setPhaseID } = useCartProps();

  useEffect(() => {
    setPhaseID("1");
  }, [setPhaseID]);

  return (
    <div className="w-full gap-4 flex flex-col 4xl_grid 4xl_grid-cols-4">
      <EditableCartTable className="4xl_col-span-3" />

      <div>
        <Bill />
      </div>
    </div>
  );
};

export default CartVisting;
