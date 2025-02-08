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
          <tr>
            <TableHead className="text-nowrap text-center text-black font-extrabold text-[1rem]">
              TÊN ĐẶT HÀNG
            </TableHead>
            <TableHead className="text-nowrap text-center text-black font-extrabold text-[1rem] hidden lg_table-cell">
              MÃ ĐƠN HÀNG
            </TableHead>
            <TableHead className="text-nowrap text-center text-black font-extrabold text-[1rem]">
              NGÀY ĐẶT
            </TableHead>
            <TableHead className="text-nowrap text-center text-black font-extrabold text-[1rem] hidden md_table-cell">
              TỔNG TIỀN
            </TableHead>
            <TableHead className="text-nowrap text-center text-black font-extrabold text-[1rem]">
              THAO TÁC
            </TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {props.invoices.map((invoice, index) => (
            <TableRow key={index}>
              <TableCell className="text-center text-base">
                {invoice.userName}
              </TableCell>
              <TableCell className="text-center text-base hidden lg_table-cell">
                <TableContextMenu textToCopy={invoice.invoiceID}>
                  {invoice.invoiceID}
                </TableContextMenu>
              </TableCell>
              <TableCell className="text-center text-base xl_text-nowrap">
                {formatDateTime(`${invoice.createdAt}`)}
              </TableCell>
              <TableCell className="text-center text-base hidden md_table-cell">{`${invoiceService.getTotalBill(invoice).toLocaleString()}đ`}</TableCell>
              <TableCell className="flex justify-center">
                <InvoiceDetailDialog
                  invoice={invoice}
                  updateInvoice={updateInvoice}
                >
                  <Button variant="neutral" className="text-base">
                    Xem
                  </Button>
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
