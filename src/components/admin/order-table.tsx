import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceFullJoin } from "@/types/model";
import { HTMLAttributes } from "react";
import { Button } from "../ui/button";
import Badge from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { invoiceService } from "@/services";
import { formatDateTime } from "@/utils/helpers";
import OrderDetailDialog from "./order-detail-dialog";
import { Separator } from "../ui/separator";

const colName: string[] = [
  "KHÁCH HÀNG",
  "ID ĐƠN HÀNG",
  "NGÀY ĐẶT HÀNG",
  "SỐ MẶT HÀNG",
  "TỔNG TIỀN",
  "TRẠNG THÁI",
  "THAO TÁC",
];

interface OrderTableProps extends HTMLAttributes<HTMLDivElement> {
  orders: InvoiceFullJoin[];
  setOrders: (invoice: InvoiceFullJoin[]) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ className, ...props }) => {
  const updateInvoice = async (invoice: InvoiceFullJoin) => {
    props.setOrders(invoiceService.updateInvoices(invoice, props.orders));
  };

  return (
    <ScrollArea className={cn("relative", className)}>
      <Table>
        <TableHeader className="z-10 border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
          <tr>
            {colName.map((item, key) => {
              return (
                <TableHead
                  key={key}
                  className=" text-center text-black font-extrabold text-[1rem]"
                >
                  {item}
                </TableHead>
              );
            })}
          </tr>
        </TableHeader>
        <TableBody>
          {props.orders.map((invoice, index) => (
            <TableRow key={index}>
              <TableCell className="text-center text-base">
                {invoice.userName}
              </TableCell>
              <TableCell className="text-center text-base">
                {invoice.invoiceID}
              </TableCell>
              <TableCell className="text-center text-base">
                {formatDateTime(`${invoice.createdAt}`)}
              </TableCell>
              <TableCell className="text-center text-base">{`${invoice.invoiceProducts.length} sản phẩm`}</TableCell>
              <TableCell className="text-center text-base">{`${invoiceService.getTotalBill(invoice).toLocaleString()}đ`}</TableCell>
              <TableCell className="text-center">
                <Badge className="bg-green-500 text-white py-2 px-4 text-sm hover_bg-green-500">
                  {invoiceService.getInvoiceStatus(invoice.status)}
                </Badge>
              </TableCell>
              <TableCell className="flex items-center justify-center space-x-2">
                <OrderDetailDialog
                  invoice={invoice}
                  updateInvoice={updateInvoice}
                >
                  <Button variant="neutral" className="text-base">
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
    </ScrollArea>
  );
};

export default OrderTable;
