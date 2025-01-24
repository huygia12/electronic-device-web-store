import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HTMLAttributes, useMemo } from "react";
import { Invoice } from "@/types/model";
import { invoiceService } from "@/services";
import {
  formatDateTime,
  getInvoicePaymentMethod,
  getInvoiceStatus,
} from "@/utils/helpers";
import Badge from "@/components/ui/badge";
import { InvoiceStatus } from "@/types/enum";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ChangeOrderStatus from "./change-order-status";
import ProductInInvoice from "@/components/common/product-in-invoice";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import excelService from "@/services/xlsx";
import pdfService from "@/services/pdfService";

interface OrderDetailDialogProps extends HTMLAttributes<HTMLDivElement> {
  invoice: Invoice;
  updateInvoice: (invoice: Invoice) => void;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  className,
  ...props
}) => {
  const invoiceState = useMemo<InvoiceStatus>(
    () => props.invoice.status,
    [props.invoice]
  );

  const setInvoiceStatus = (status: InvoiceStatus) => {
    const updateInvoice = invoiceService.apis.upateInvoice(
      props.invoice.invoiceID,
      { status: status }
    );

    toast.promise(updateInvoice, {
      loading: "Đang xử lý...",
      success: (invoice: Invoice) => {
        props.updateInvoice(invoice);
        return "Cập nhật trạng thái đơn hàng thành công!";
      },
      error: "Cập nhật trạng thái đơn hàng thất bại!",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="min-w-lg 3xl_min-w-2xl">
        <DialogHeader>
          <DialogTitle className="border-b-2 pb-4 border-dashed border-slate-500 flex justify-between">
            <span className="text-3xl font-light">Thông Tin Đơn Hàng</span>
            <span className="mr-4 space-x-4 flex items-center">
              <span>{props.invoice.invoiceID}</span>
              <Badge
                className={cn(
                  `rounded-md text-white py-1 px-4 text-lg hover_!${invoiceService.getInvoiceStatusColor(
                    props.invoice.status
                  )}`,
                  invoiceService.getInvoiceStatusColor(props.invoice.status)
                )}
              >
                {getInvoiceStatus(props.invoice.status)}
              </Badge>
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex mt-4">
          <div className="flex flex-col w-1/2">
            <span className="text-xl font-semibold">Thông Tin Khách Hàng</span>
            <span className="mt-2 ">{props.invoice.userName}</span>
            <span className="mt-1 ">{`${props.invoice.detailAddress}, ${props.invoice.ward}, ${props.invoice.district}, ${props.invoice.province}`}</span>
            <span className="mt-1 ">{props.invoice.email}</span>
            <span className="mt-1 ">SĐT: {props.invoice.phoneNumber}</span>
          </div>
          <div className="flex flex-col w-1/2 items-end">
            <span className="text-xl font-semibold">
              Phương Thức Thanh Toán
            </span>
            <span>{getInvoicePaymentMethod(props.invoice.payment)}</span>
            <span className="text-xl mt-2 font-semibold">
              Phương Thức Vận Chuyển
            </span>
            <span>Giao hàng nhanh</span>
            <span className="text-xl mt-2 font-semibold">Phí vận chuyển</span>
            <span>{`${props.invoice.shippingFee.toLocaleString()}đ`}</span>
            <span className="text-xl mt-2 font-semibold">Ngày Đặt Hàng</span>
            <span>{formatDateTime(`${props.invoice.createdAt}`)}</span>
          </div>
        </div>

        <ChangeOrderStatus
          invoiceID={props.invoice.invoiceID}
          invoiceState={invoiceState}
          setInvoiceState={setInvoiceStatus}
          className="mt-10"
        />

        <ProductInInvoice
          products={props.invoice.invoiceProducts}
          className="mt-10"
        />

        <div className="pt-4 flex items-center border-t-2 border-slate-500 border-dashed justify-between space-x-2">
          <span>
            <span className="text-2xl font-semibold mr-4">TỔNG TIỀN :</span>
            <span className="text-2xl font-medium">{`${invoiceService.getTotalBill(props.invoice).toLocaleString()}đ`}</span>
          </span>
          <span className="ml-auto space-x-2">
            <Button
              onClick={() => excelService.exportInvoice(props.invoice)}
              className="ml-auto bg-white !text-green-500 !border-green-500 border-2 text-base hover_!bg-green-500 hover_!text-white"
            >
              <Download className="mr-2" /> Xuất Tệp Excel
            </Button>
            <Button
              onClick={() => pdfService.exportInvoice(props.invoice)}
              className="ml-auto bg-white !text-red-500 !border-red-500 border-2 text-base hover_!bg-red-500 hover_!text-white"
            >
              <Download className="mr-2" />
              Xuất Tệp PDF
            </Button>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
