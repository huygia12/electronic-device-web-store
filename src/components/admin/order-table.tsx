import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "@/types/model";
import { HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { invoiceService } from "@/services";
import { formatDateTime, getInvoiceStatus } from "@/utils/helpers";
import OrderDetailDialog from "./order-detail-dialog";
import { Separator } from "@/components/ui/separator";

const headers = [
  { title: "KHÁCH HÀNG" },
  {
    title: "ID ĐƠN HÀNG",
    css: "hidden lg_table-cell",
  },
  {
    title: "NGÀY ĐẶT",
  },
  {
    title: "SỐ MẶT HÀNG",
  },
  {
    title: "THÀNH TIỀN",
  },
  {
    title: "TRẠNG THÁI",
    css: "hidden xl_table-cell",
  },
  {
    title: "THAO TÁC",
  },
];

interface OrderTableProps extends HTMLAttributes<HTMLDivElement> {
  orders: Invoice[];
  setOrders: (invoice: Invoice[]) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ className, ...props }) => {
  const updateInvoice = async (invoice: Invoice) => {
    props.setOrders(
      invoiceService.deleteInvoice(invoice.invoiceID, props.orders)
    );
  };

  return (
    <ScrollArea className={cn("relative", className)}>
      <Table>
        <TableHeader className="z-10 border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
          <tr className="text-nowrap text-xs md_text-base text-black">
            {headers.map((header, index) => (
              <TableHead
                key={index}
                className={cn("font-extrabold text-center", header.css)}
              >
                {header.title}
              </TableHead>
            ))}
          </tr>
        </TableHeader>

        <TableBody className="p-0">
          {props.orders.map((invoice, index) => (
            <TableRow key={index} className="text-center text-xs md_text-base">
              <TableCell>{invoice.userName}</TableCell>
              <TableCell className="hidden lg_table-cell">
                {invoice.invoiceID}
              </TableCell>
              <TableCell className="xl_text-nowrap">
                {formatDateTime(`${invoice.createdAt}`)}
              </TableCell>
              <TableCell>{`${invoice.invoiceProducts.length} sản phẩm`}</TableCell>
              <TableCell>{`${invoiceService.getTotalBill(invoice).toLocaleString()}đ`}</TableCell>
              <TableCell className="hidden xl_table-cell">
                <Badge
                  className={cn(
                    `text-white px-2 text-sm whitespace-normal break-words max-w-[8rem] hover_!${invoiceService.getInvoiceStatusColor(
                      invoice.status
                    )}`,
                    invoiceService.getInvoiceStatusColor(invoice.status)
                  )}
                >
                  {getInvoiceStatus(invoice.status)}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-center items-center">
                <OrderDetailDialog
                  invoice={invoice}
                  updateInvoice={updateInvoice}
                >
                  <Button variant="neutral" className="text-inherit">
                    Xem
                  </Button>
                </OrderDetailDialog>
              </TableCell>
            </TableRow>
          ))}
          <tr>
            <td>
              <Separator />
            </td>
          </tr>
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default OrderTable;
