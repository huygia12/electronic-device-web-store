import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HTMLAttributes, useMemo } from "react";
import { InvoiceFullJoin } from "@/types/model";
import { invoiceService } from "@/services";
import { formatDateTime } from "@/utils/helpers";
import Badge from "../ui/badge";
import { InvoiceStatus } from "@/types/enum";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { ProductInInvoice } from "@/components/common";
import { cn } from "@/lib/utils";
import OrderCancelDialog from "./order-cancel-dialog";

interface InvoiceDetailDialogProps extends HTMLAttributes<HTMLDivElement> {
  disableAction?: boolean;
  invoice: InvoiceFullJoin;
  updateInvoice: (invoice: InvoiceFullJoin) => void;
}

const InvoiceDetailDialog: React.FC<InvoiceDetailDialogProps> = ({
  className,
  ...props
}) => {
  const invoiceState = useMemo<InvoiceStatus>(
    () => props.invoice.status,
    [props.invoice]
  );

  const payOrder = async () => {
    const toastID = toast.loading("Đang xử lý...");
    try {
      const paymentUrl = await invoiceService.apis.payOrder(
        props.invoice.invoiceID
      );

      window.location.href = paymentUrl;
    } catch {
      toast.error("Thanh toán thất bại!");
    } finally {
      toast.dismiss(toastID);
    }
  };

  const abortOrder = () => {
    const updateInvoice = invoiceService.apis.upateInvoice(
      props.invoice.invoiceID,
      { status: InvoiceStatus.ABORT }
    );

    toast.promise(updateInvoice, {
      loading: "Đang xử lý...",
      success: (invoice: InvoiceFullJoin) => {
        props.updateInvoice(invoice);
        return "Hủy đơn hàng thành công!";
      },
      error: "Hủy đơn hàng thất bại!",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="min-w-[90rem]">
        <DialogHeader>
          <DialogTitle className="border-b-2 pb-4 border-dashed border-slate-500 flex justify-between">
            <span className="text-3xl font-light">Thông Tin Đơn Hàng</span>
            <span className="mr-4 space-x-4 flex items-center">
              <span>{props.invoice.invoiceID}</span>
              <Badge className="bg-green-500 rounded-md text-white py-1 px-4 text-lg hover_bg-green-500">
                {invoiceService.getInvoiceStatus(invoiceState)}
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
            <span className="mt-1 ">{props.invoice.phoneNumber}</span>
          </div>
          <div className="flex flex-col w-1/2 items-end">
            <span className="text-xl font-semibold">
              Phương Thức Thanh Toán
            </span>
            <span>
              {invoiceService.getInvoicePaymentMethod(props.invoice.payment)}
            </span>
            <span className="text-xl mt-3 font-semibold">
              Phương Thức Vận Chuyển
            </span>
            <span>Giao hàng nhanh</span>
            <span className="text-xl mt-3 font-semibold">Ngày Đặt Hàng</span>
            <span>{formatDateTime(`${props.invoice.createdAt}`)}</span>
          </div>
        </div>

        <ProductInInvoice
          products={props.invoice.invoiceProducts}
          className="mt-10"
        />

        <div className="pt-4 flex items-center border-t-2 border-slate-500 border-dashed justify-between space-x-2">
          <span>
            <span className="text-2xl font-semibold mr-4">TỔNG TIỀN :</span>
            <span className="text-2xl font-medium">{`${invoiceService.getTotalBill(props.invoice).toLocaleString()}đ`}</span>
          </span>
          <span
            className={cn("ml-auto space-x-2", props.disableAction && "hidden")}
          >
            <Button
              disabled={invoiceService.getUserButtonDisabled(
                "accept",
                invoiceState
              )}
              variant="neutral"
              onClick={payOrder}
            >
              Thanh toán
            </Button>
            <OrderCancelDialog handleConfirm={abortOrder}>
              <Button
                disabled={invoiceService.getUserButtonDisabled(
                  "cancel",
                  invoiceState
                )}
                variant="negative"
              >
                Hủy đơn hàng
              </Button>
            </OrderCancelDialog>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailDialog;
