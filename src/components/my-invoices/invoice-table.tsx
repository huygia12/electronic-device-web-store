import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "@/types/model";
import { FC, HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { invoiceService } from "@/services";
import { formatDateTime } from "@/utils/helpers";
import InvoiceDetailDialog from "./invoice-detail-dialog";
import { Separator } from "@/components/ui/separator";
import TableContextMenu from "../common/table-context-menu";

const columnHeaders = [
  { title: "TÊN ĐẶT HÀNG", css: "hidden lg_table-cell" },
  { title: "MÃ ĐƠN HÀNG", css: "hidden md_table-cell" },
  { title: "NGÀY ĐẶT" },
  { title: "TỔNG TIỀN" },
  { title: "THAO TÁC" },
];

interface OrderTableProps extends HTMLAttributes<HTMLDivElement> {
  invoices: Invoice[];
  setInvoices: (invoice: Invoice[]) => void;
}

const InvoiceTable: FC<OrderTableProps> = ({ className, ...props }) => {
  const updateInvoice = async (invoice: Invoice) => {
    props.setInvoices(
      invoiceService.deleteInvoice(invoice.invoiceID, props.invoices)
    );
  };

  return (
    <ScrollArea className={cn("relative", className)}>
      <Table>
        <TableHeader className="z-10 border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
          <tr className="text-nowrap text-black text-sm md_text-[1rem]">
            {columnHeaders.map((header, index) => {
              return (
                <TableHead
                  key={index}
                  className={cn("text-center font-extrabold", header.css)}
                >
                  {header.title}
                </TableHead>
              );
            })}
          </tr>
        </TableHeader>
        <TableBody>
          {props.invoices.map((invoice, index) => (
            <TableRow key={index} className="tex-sm md_text-base">
              <TableCell className="text-center hidden lg_table-cell">
                {invoice.userName}
              </TableCell>
              <TableCell className="text-center hidden md_table-cell">
                <TableContextMenu textToCopy={invoice.invoiceID}>
                  {invoice.invoiceID}
                </TableContextMenu>
              </TableCell>
              <TableCell className="text-center xl_text-nowrap">
                {formatDateTime(`${invoice.createdAt}`)}
              </TableCell>
              <TableCell className="text-center">{`${invoiceService.getTotalBill(invoice).toLocaleString()}đ`}</TableCell>
              <TableCell className="flex justify-center">
                <InvoiceDetailDialog
                  invoice={invoice}
                  updateInvoice={updateInvoice}
                >
                  <Button variant="neutral">Xem</Button>
                </InvoiceDetailDialog>
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

export default InvoiceTable;
