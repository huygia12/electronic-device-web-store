import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CartItem, Error } from "@/types/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useCartProps } from "@/hooks";
import { buttonVariants } from "@/utils/constants";
import routes from "../middleware/routes";
import { arrayInReverse } from "@/utils/helpers";
import productService from "@/utils/product";

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

const CartVisting: FC = () => {
  const { itemsInLocal, setItemsInLocal, removeInvoice, setPhaseID } =
    useCartProps();
  const [quantityErrors, setQuantityErrors] = useState<Error[]>(
    new Array(itemsInLocal.length).fill({ sucess: true })
  );

  useEffect(() => {
    setPhaseID("1");
  }, [setPhaseID]);

  const handleNextStepEvent = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    await routes.navigate("/cart/checkout", {
      unstable_viewTransition: true,
    });
  };

  const handleDeleteCartItem = (
    e: React.MouseEvent<HTMLButtonElement>,
    deletingProductID: string,
    deletingItemID: string
  ) => {
    e.preventDefault();

    const bucket: CartItem[] = [];
    itemsInLocal.map((item) => {
      if (
        item.productID != deletingProductID ||
        item.itemID != deletingItemID
      ) {
        bucket.push(item);
      }
    });
    setItemsInLocal(bucket);
  };

  const handleQuantityInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    productID: string,
    itemID: string
  ) => {
    e.preventDefault();

    const newQuantity = Number(e.target.value);
    const bucket: Error[] = quantityErrors.map((element, iter) => {
      if (iter === index) {
        if (newQuantity < 1) {
          return {
            success: false,
            message: "Không hợp lệ!",
          };
        } else {
          const localItems: CartItem[] = itemsInLocal.map((item) =>
            item.productID === productID && item.itemID === itemID
              ? {
                  ...item,
                  quantity: newQuantity,
                }
              : item
          );
          setItemsInLocal(localItems);

          return { success: true };
        }
      }
      return element;
    });
    setQuantityErrors(bucket);
  };

  return (
    <div className="grid grid-cols-4 w-full gap-4">
      {/** CART LIST */}
      <section className="col-span-3 flex flex-col border-2 border-slate-2 rounded-md p-4">
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
                  {arrayInReverse<CartItem>(itemsInLocal).map((prod, index) => {
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
                        <TableCell className="text-center text-base max-w-[15rem] truncate">
                          {prod.productName}
                          <br />
                          {`${prod.storage} | ${prod.color}`}
                        </TableCell>
                        <TableCell className="text-center text-base">
                          {prod.price.toLocaleString() + "đ"}
                        </TableCell>
                        <TableCell className="text-center text-base">
                          {prod.discount + "%"}
                        </TableCell>
                        <TableCell className="text-center text-base">
                          {productService
                            .afterDiscount(prod.price, prod.discount)
                            .toLocaleString() + "đ"}
                        </TableCell>
                        <TableCell className="text-center text-base">
                          <Input
                            id="quantity"
                            type="number"
                            className="max-w-20 mt-2 mx-auto"
                            min={1}
                            onChange={(e) =>
                              handleQuantityInput(
                                e,
                                index,
                                prod.productID,
                                prod.itemID
                              )
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
                            onClick={(e) =>
                              handleDeleteCartItem(
                                e,
                                prod.productID,
                                prod.itemID
                              )
                            }
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
            <AlertDialog>
              <AlertDialogTrigger
                className={cn(
                  "w-full mt-auto",
                  buttonVariants({ variant: "negative" })
                )}
              >
                Xóa hết giỏ hàng
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Bạn muốn xóa hết giỏ hàng?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex items-center">
                  <AlertDialogCancel className="m-0">Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    className={cn(buttonVariants({ variant: "negative" }))}
                    onClick={() => removeInvoice()}
                  >
                    Xác nhân
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </section>

      {/** BILL */}
      <section className="rounded-md">
        <Card className="">
          <CardHeader className="px-4">
            <CardTitle className="mb-4">ĐƠN HÀNG</CardTitle>
            <CardDescription>
              Quý khách vui lòng nhập thông tin giao hàng ở bước tiếp theo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4">
            <Separator className="border-dashed" />
            <div className="flex justify-between">
              <span>Tổng tiền hàng</span>
              <span>
                {productService.getTotalAmount(itemsInLocal).toLocaleString() +
                  "đ"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tổng tiền giảm giá</span>
              <del>
                {productService
                  .getTotalDiscountAmount(itemsInLocal)
                  .toLocaleString() + "đ"}
              </del>
            </div>
            <Separator className="border-dashed" />
            <div className="flex justify-between items-center font-semibold">
              <span className="text-primary text-xl">Tổng thanh toán</span>
              <span>
                {(
                  productService.getTotalAmount(itemsInLocal) -
                  productService.getTotalDiscountAmount(itemsInLocal)
                ).toLocaleString() + "đ"}
              </span>
            </div>
          </CardContent>
          <CardFooter className="mt-4 px-4">
            {/* <NavLink to="/cart/checkout"> */}
            <Button
              variant="neutral"
              disabled={itemsInLocal.length === 0}
              className="ml-auto"
              onClick={async (e) => await handleNextStepEvent(e)}
            >
              Đặt hàng
            </Button>
            {/* </NavLink> */}
          </CardFooter>
        </Card>
      </section>
    </div>
  );
};

export default CartVisting;
