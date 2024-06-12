import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import log from "loglevel";
import { Button } from "@/components/ui/button";
import { CartItem, LocalStorageProductItem, Product } from "@/declare";
import {
  afterDiscount,
  getTotalAmount,
  getTotalDiscountAmount,
} from "@/utils/product";
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
import { useLocalStorage } from "@/utils/customHook";

log.setLevel("error");

const header = [
  "STT",
  "Ảnh",
  "Sản Phẩm",
  "Giá",
  "Số lượng",
  "Giảm Giá",
  "Thành Tiền",
  "Thao tác",
];

const CartVisting = () => {
  const [itemsInLocal] = useLocalStorage<LocalStorageProductItem[]>("cart", []);
  const [invoiceProductData, setInvoiceProductData] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await axios.get<Product[]>(
          "http://localhost:4000/products"
        );

        const bucket: CartItem[] = [];
        itemsInLocal.forEach((localItem) => {
          productsRes.data.forEach((product) => {
            product.items.forEach((item) => {
              if (
                item.itemID === localItem.itemID &&
                product.id === localItem.productID
              ) {
                bucket.push({
                  id: product.id,
                  productName: product.productName,
                  height: product.height,
                  weight: product.weight,
                  len: product.len,
                  width: product.width,
                  itemID: item.itemID,
                  thump: item.thump,
                  quantity: localItem.quantity,
                  price: item.price,
                  productCode: item.productCode,
                  discount: item.discount,
                  colorName: item.colorName,
                  storageName: item.storageName,
                });
              }
            });
          });
        });

        setInvoiceProductData(bucket);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          // AxiosError-specific handling
          log.error("Axios error:", error.message);
          if (error.response) {
            log.error("Response data:", error.response.data);
            log.error("Response status:", error.response.status);
          }
        } else {
          // General error handling
          log.error("Unexpected error:", error);
        }
      }
    };

    fetchData();
  }, [itemsInLocal]);

  return (
    <div className="grid grid-cols-4 w-full gap-4">
      {/** CART LIST */}
      <section className="col-span-3 flex flex-col border-2 border-slate-2 rounded-md p-4">
        {invoiceProductData.length === 0 ? (
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
                  {invoiceProductData.map((prod, index) => {
                    return (
                      <TableRow key={index} className="">
                        <TableCell className="text-center text-base">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center text-base">
                          <img
                            src={prod.thump}
                            alt={prod.id}
                            className="max-h-20"
                          />
                        </TableCell>
                        <TableCell className="text-center text-base max-w-[15rem] truncate">
                          {prod.productName}
                          <br />
                          {`${prod.storageName} | ${prod.colorName}`}
                        </TableCell>
                        <TableCell className="text-center text-base">
                          {prod.price.toLocaleString() + "đ"}
                        </TableCell>
                        <TableCell className="text-center text-base">
                          <Input
                            id="quantity"
                            type="number"
                            className="max-w-20 mt-2"
                            min={1}
                            defaultValue={prod.quantity}
                          />
                        </TableCell>
                        <TableCell className="text-center text-base">
                          {prod.discount + "%"}
                        </TableCell>
                        <TableCell className="text-center text-base">
                          {afterDiscount(
                            prod.price,
                            prod.discount
                          ).toLocaleString() + "đ"}
                        </TableCell>
                        <TableCell className="text-center text-base">
                          <Button variant="negative">
                            <Trash2 />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
            <Button variant="negative" className="w-full">
              Xóa hết giỏ hàng
            </Button>
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
                {getTotalAmount(invoiceProductData).toLocaleString() + "đ"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tổng tiền giảm giá</span>
              <del>
                {getTotalDiscountAmount(invoiceProductData).toLocaleString() +
                  "đ"}
              </del>
            </div>
            <Separator className="border-dashed" />
            <div className="flex justify-between items-center font-semibold">
              <span className="text-primary text-xl">Tổng thanh toán</span>
              <span>
                {(
                  getTotalAmount(invoiceProductData) -
                  getTotalDiscountAmount(invoiceProductData)
                ).toLocaleString() + "đ"}
              </span>
            </div>
          </CardContent>
          <CardFooter className="mt-4 px-4">
            <Button
              variant="neutral"
              disabled={invoiceProductData.length === 0}
              className="ml-auto"
            >
              Thanh Toán
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
};

export { CartVisting };
