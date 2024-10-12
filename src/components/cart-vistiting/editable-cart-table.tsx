import { FC, HTMLAttributes, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { applyDiscount, getDiscount } from "@/utils/helpers";
import { NavLink } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCartProps } from "@/hooks";
import { Error } from "@/types/error";
import DeleteAllItemsDialog from "./delete-all-items-dialog";
import { cartService } from "@/services";
import { cn } from "@/lib/utils";

const header = [
  "STT",
  "Ảnh",
  "Sản Phẩm",
  "Giá",
  "Giảm Giá",
  "Thành Tiền",
  "Số lượng",
  "Thao tác",
];

const EditableCartTable: FC<HTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => {
  const { itemsInLocal, setItemsInLocal } = useCartProps();
  const [quantityErrors, setQuantityErrors] = useState<Error[]>(
    new Array(itemsInLocal.length).fill({ sucess: true })
  );

  const handleDeleteCartItem = (
    e: React.MouseEvent<HTMLButtonElement>,
    deletingItemID: string
  ) => {
    e.preventDefault();

    setItemsInLocal(cartService.deleteCartItem(itemsInLocal, deletingItemID));
  };

  const handleAdjustCartItemQuantity = (
    e: React.ChangeEvent<HTMLInputElement>,
    indexOfRow: number,
    itemID: string
  ) => {
    e.preventDefault();

    const newQuantity = Number(e.target.value);

    // Update Item quantity
    newQuantity > 0 &&
      setItemsInLocal(
        cartService.updateItemQuantityy(itemsInLocal, itemID, newQuantity)
      );

    //Update errors
    setQuantityErrors(
      cartService.updateQuantityErrors(quantityErrors, indexOfRow, newQuantity)
    );
  };

  return (
    <section
      className={cn(
        "col-span-3 flex flex-col border-2 border-slate-2 rounded-md",
        props.className
      )}
    >
      {itemsInLocal.length === 0 ? (
        <div className="flex flex-col items-center">
          <img width={400} src="/emptyCart.svg" alt="emptyCart" />
          <span className="text-lg font-medium text-slate-500">
            Giỏ hàng của bạn đang trống!
          </span>
        </div>
      ) : (
        <>
          <ScrollArea className="w-full max-h-[30rem] rounded-md mb-10 border-slate-200 border-b-2">
            <Table>
              <TableHeader className="z-10 sticky top-0 border-b-2 bg-white shadow-lg">
                <tr>
                  {header.map((title, index) => {
                    return (
                      <TableHead
                        className=" text-center text-black font-extrabold text-[1rem]"
                        key={index}
                      >
                        {title}
                      </TableHead>
                    );
                  })}
                </tr>
              </TableHeader>
              <TableBody>
                {itemsInLocal.map((prod, index) => {
                  return (
                    <TableRow key={index} className="">
                      <TableCell className="text-center text-base">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-center text-base">
                        <img
                          src={prod.thump}
                          alt={prod.productID}
                          className="max-h-20"
                        />
                      </TableCell>
                      <TableCell className="text-center text-base max-w-[15rem] truncate hover_underline hover_text-primary">
                        <NavLink
                          to={"/products/" + prod.productID}
                          unstable_viewTransition
                        >
                          {prod.productName}
                          <br />
                          {`${prod.storage} | ${prod.color}`}
                        </NavLink>
                      </TableCell>
                      <TableCell className="text-center text-base">
                        {prod.price.toLocaleString() + "đ"}
                      </TableCell>
                      <TableCell className="text-center text-base">
                        {getDiscount(prod.discount) + "%"}
                      </TableCell>
                      <TableCell className="text-center text-base">
                        {applyDiscount(
                          prod.price,
                          prod.discount
                        ).toLocaleString() + "đ"}
                      </TableCell>
                      <TableCell className="text-center text-base">
                        <Input
                          id="quantity"
                          type="number"
                          className="max-w-20 mt-2 mx-auto"
                          min={1}
                          onChange={(e) =>
                            handleAdjustCartItemQuantity(e, index, prod.itemID)
                          }
                          value={prod.quantity}
                        />
                        {quantityErrors[index] &&
                          !quantityErrors[index].success && (
                            <div className="text-red-600 mt-2 mx-auto">
                              {quantityErrors[index].message}
                            </div>
                          )}
                      </TableCell>
                      <TableCell className="text-center text-base">
                        <Button
                          onClick={(e) => handleDeleteCartItem(e, prod.itemID)}
                          variant="negative"
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
          <DeleteAllItemsDialog />
        </>
      )}
    </section>
  );
};

export default EditableCartTable;
