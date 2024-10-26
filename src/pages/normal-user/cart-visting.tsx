import { useCartProps } from "@/hooks";
import { Bill, EditableCartTable } from "@/components/cart-vistiting";
import { FC, useEffect } from "react";

const CartVisting: FC = () => {
  const { setPhaseID } = useCartProps();

  useEffect(() => {
    setPhaseID("1");
  }, [setPhaseID]);
  return (
    <div className="flex flex-col 3xl_grid 3xl_grid-cols-4 w-full gap-4">
      <EditableCartTable className="3xl_col-span-3" />

      <div className="">
        <Bill />
      </div>
    </div>
  );
};

export default CartVisting;
