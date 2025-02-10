import { InvoiceProduct } from "@/types/model";
import { FC, HTMLAttributes } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
import { cn } from "@/lib/utils";

const columnHeaders = [
  { title: "STT", css: "hidden xss_table-cell" },
  { title: "Ảnh" },
  { title: "Sản Phẩm" },
  { title: "Nhãn Hàng", css: "hidden lgg_table-cell" },
  { title: "Phân Loại", css: "hidden lgg_table-cell" },
  { title: "SL" },
  { title: "Giảm Giá", css: "hidden mlg_table-cell" },
  { title: "Thành Tiền", css: "hidden mlg_table-cell" },
];

interface ProductInOrder extends HTMLAttributes<HTMLDivElement> {
  products: InvoiceProduct[];
}

const ProductInInvoice: FC<ProductInOrder> = ({ ...props }) => {
  return (
    <div className={props.className}>
      <label
        htmlFor="product-list"
        className="text-base md_text-xl font-semibold"
      >
        Thông Tin Sản Phẩm
      </label>
      <ScrollArea
        id="product-list"
        className="w-full min-h-max max-h-[30rem] mt-4 rounded-md border-slate-200 border-b-2"
      >
        <Table>
          <TableHeader className="z-10 sticky top-0 border-b-2 bg-white shadow-lg">
            <tr className="text-nowrap text-black text-sm md_text-[1rem]">
              {columnHeaders.map((e, index) => {
                return (
                  <TableHead
                    className={cn("text-center font-extrabold", e.css)}
                    key={index}
                  >
                    {e.title}
                  </TableHead>
                );
              })}
            </tr>
          </TableHeader>
          <TableBody>
            {props.products.map((product, index) => {
              return (
                <TableRow key={index} className="text-sm md_text-base">
                  <TableCell className="text-center hidden xss_table-cell">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-center">
                    <img
                      src={product.thump}
                      alt={product.productID}
                      className="max-h-20 mx-auto"
                    />
                  </TableCell>
                  <TableCell className="text-center max-w-[15rem] truncate hover_underline hover_text-primary-foreground cursor-pointer">
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
                  <TableCell className="text-center hidden lgg_table-cell">
                    {product.providerName}
                  </TableCell>
                  <TableCell className="text-center hidden lgg_table-cell">
                    {product.categoryName}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.quantity}
                  </TableCell>
                  <TableCell className="text-center hidden mlg_table-cell">
                    {getDiscount(product.discount) + "%"}
                  </TableCell>
                  <TableCell className="text-center hidden mlg_table-cell">
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default ProductInInvoice;
