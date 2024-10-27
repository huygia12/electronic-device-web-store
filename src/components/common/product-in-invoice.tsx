import { InvoiceProduct } from "@/types/model";
import { FC, HTMLAttributes } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
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

const columnHeaders = [
  "STT",
  "Ảnh",
  "Sản Phẩm",
  "Nhãn Hàng",
  "Phân Loại",
  "Số lượng",
  "Giảm Giá",
  "Thành Tiền",
];

interface ProductInOrder extends HTMLAttributes<HTMLDivElement> {
  products: InvoiceProduct[];
}

const ProductInInvoice: FC<ProductInOrder> = ({ ...props }) => {
  return (
    <div className={props.className}>
      <label htmlFor="product-list" className="text-xl font-semibold">
        Thông Tin Sản Phẩm
      </label>
      <ScrollArea
        id="product-list"
        className="w-full max-h-[30rem] mt-4 rounded-md border-slate-200 border-b-2"
      >
        <Table>
          <TableHeader className="z-10 sticky top-0 border-b-2 bg-white shadow-lg">
            <tr>
              {columnHeaders.map((title, index) => {
                return (
                  <TableHead
                    className="text-nowrap text-center text-black font-extrabold text-[1rem]"
                    key={index}
                  >
                    {title}
                  </TableHead>
                );
              })}
            </tr>
          </TableHeader>
          <TableBody>
            {props.products.map((product, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="text-center text-base">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-center text-base">
                    <img
                      src={product.thump}
                      alt={product.productID}
                      className="max-h-20 mx-auto"
                    />
                  </TableCell>
                  <TableCell className="text-center text-base max-w-[15rem] truncate hover_underline hover_text-primary-foreground cursor-pointer">
                    <NavLink
                      to={"/products/" + product.productID}
                      target="_blank"
                      unstable_viewTransition
                    >
                      {product.productName}
                      <br />
                      {`${product.storage} | ${product.color}`}
                    </NavLink>
                  </TableCell>
                  <TableCell className="text-center text-base">
                    {product.providerName}
                  </TableCell>
                  <TableCell className="text-center text-base">
                    {product.categoryName}
                  </TableCell>
                  <TableCell className="text-center text-base">
                    {product.quantity}
                  </TableCell>
                  <TableCell className="text-center text-base">
                    {getDiscount(product.discount) + "%"}
                  </TableCell>
                  <TableCell className="text-center text-base">
                    {applyDiscount(
                      product.price,
                      product.discount
                    ).toLocaleString() + "đ"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default ProductInInvoice;
