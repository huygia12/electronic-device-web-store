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
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCartProps } from "@/hooks";
import DeleteAllItemsDialog from "./delete-all-items-dialog";
import { cartService } from "@/services";
import { cn } from "@/lib/utils";
import { Error } from "@/types/component";

const columnHeaders = [
  { title: "STT", css: "hidden sms_table-cell" },
  { title: "Ảnh" },
  { title: "Sản Phẩm" },
  { title: "Giá", css: "hidden lgg_table-cell" },
  { title: "Giảm Giá", css: "hidden mlg_table-cell" },
  { title: "Thành Tiền", css: "hidden sm_table-cell" },
  { title: "SL", css: "hidden min-[420px]_table-cell" },
  { title: "Thao tác" },
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
        "flex flex-col border-2 border-slate-2 rounded-md shadow-md p-0 sm_p-4",
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
          <Table className="w-full max-h-[30rem] rounded-md mb-10 border-slate-200 border-b-2">
            <TableHeader className="z-10 sticky top-0 border-b-2 bg-white shadow-lg">
              <tr className="text-nowrap text-black text-sm md_text-base">
                {columnHeaders.map((header, index) => {
                  return (
                    <TableHead
                      className={cn("text-center font-extrabold", header.css)}
                      key={index}
                    >
                      {header.title}
                    </TableHead>
                  );
                })}
              </tr>
            </TableHeader>
            <TableBody>
              {itemsInLocal.map((prod, index) => {
                return (
                  <TableRow key={index} className="text-sm md_text-base">
                    <TableCell className="text-center hidden sms_table-cell">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-center">
                      <img
                        src={prod.thump}
                        alt={prod.productID}
                        className="max-h-20 mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center hover_underline hover_text-primary">
                      <NavLink
                        to={"/products/" + prod.productID}
                        target="_blank"
                        unstable_viewTransition
                      >
                        <div className="line-clamp-1 w-[10rem] sm_w-[12rem]">
                          {prod.productName}
                        </div>
                        {`${prod.storage} | ${prod.color}`}
                        <span className="inline sm_hidden">
                          <br />
                          {applyDiscount(
                            prod.price,
                            prod.discount
                          ).toLocaleString() + "đ"}
                        </span>
                      </NavLink>
                      <div className="block min-[420px]_hidden">
                        <Input
                          id="quantity"
                          type="number"
                          className="w-16 mx-auto mt-2"
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
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden lgg_table-cell">
                      {prod.price.toLocaleString() + "đ"}
                    </TableCell>
                    <TableCell className="text-center hidden mlg_table-cell">
                      {getDiscount(prod.discount) + "%"}
                    </TableCell>
                    <TableCell className="text-center hidden sm_table-cell">
                      {applyDiscount(
                        prod.price,
                        prod.discount
                      ).toLocaleString() + "đ"}
                    </TableCell>
                    <TableCell className="text-center hidden min-[420px]_table-cell">
                      <Input
                        id="quantity"
                        type="number"
                        className="w-16 mx-auto mt-2"
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
                    <TableCell className="text-center">
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
          <DeleteAllItemsDialog />
        </>
      )}
    </section>
  );
};

export default EditableCartTable;
