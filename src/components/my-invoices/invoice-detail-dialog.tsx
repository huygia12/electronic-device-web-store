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
import { toast } from "sonner";
import { ProductInInvoice } from "@/components/common";
import { cn } from "@/lib/utils";
import InvoiceCancelDialog from "./cancel-dialog";
import { ScrollArea } from "../ui/scroll-area";
import { useSocket } from "@/hooks";

interface InvoiceDetailDialogProps extends HTMLAttributes<HTMLDivElement> {
  disableAction?: boolean;
  invoice: Invoice;
  updateInvoice: (invoice: Invoice) => void;
}

const InvoiceDetailDialog: React.FC<InvoiceDetailDialogProps> = ({
  className,
  ...props
}) => {
  const invoiceState = useMemo<InvoiceStatus>(
    () => props.invoice.status,
    [props.invoice]
  );
  const { socket } = useSocket();

  const payOrder = async () => {
    const toastID = toast.loading("Đang xử lý...");
    try {
      const paymentUrl = await invoiceService.apis.payInvoice(
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
      success: (invoice: Invoice) => {
        props.updateInvoice(invoice);
        socket?.emit(`invoice:update-status`, {
          userID: invoice.userID,
          newStatus: invoice.status,
        });
        return "Hủy đơn hàng thành công!";
      },
      error: "Hủy đơn hàng thất bại!",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="mlg_min-w-max max-h-screen px-2 pb-0">
        <DialogHeader>
          <DialogTitle className="border-b-2 pb-4 px-6 border-dashed border-slate-500 flex justify-between">
            <span className="font-light text-xl md_text-2xl mlg_text-3xl">
              Thông Tin Đơn Hàng
            </span>
            <span className="mr-4 space-x-4 flex items-center">
              <span className="hidden xl_block">{props.invoice.invoiceID}</span>
              <Badge
                className={cn(
                  `rounded-md text-white py-1 px-4 hidden mlg_block text-base mlg_text-lg hover_!${invoiceService.getInvoiceStatusColor(
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
        <ScrollArea className="mb-4 max-h-[70vh] 2xl_max-h-[80vh]">
          <div className="flex flex-col mlg_flex-row">
            <div className="flex flex-col mlg_w-1/2">
              <div className="block mb-2 lgg_hidden">
                <div className="text-base md_text-xl font-semibold">
                  Mã đơn hàng
                </div>
                <span>{props.invoice.invoiceID}</span>
              </div>
              <span className="text-base md_text-xl font-semibold">
                Thông Tin Khách Hàng
              </span>
              <span>Tên:&nbsp;{props.invoice.userName}</span>
              <span className="flex">
                <span className="text-nowrap">Địa chỉ:&nbsp;</span>
                <span className="italic flex flex-col mlg_inline">
                  <span>{`${props.invoice.detailAddress},`} </span>
                  <span>{`${props.invoice.ward},`} </span>
                  <span>{`${props.invoice.district},`}</span>
                  <span>{`${props.invoice.province}`}</span>
                </span>
              </span>
              <span>
                Email:&nbsp;
                <span className="italic">{props.invoice.email}</span>
              </span>
              <span>SĐT:&nbsp;{props.invoice.phoneNumber}</span>
            </div>
            <div className="flex flex-col mt-2 mlg_mt-0 mlg_items-end mlg_w-1/2">
              <span className="text-base md_text-xl font-semibold">
                Phương Thức Thanh Toán
              </span>
              <span>{getInvoicePaymentMethod(props.invoice.payment)}</span>
              <span className="text-base md_text-xl mt-2 font-semibold">
                Phương Thức Vận Chuyển
              </span>
              <span>Giao hàng nhanh</span>
              <span className="text-base md_text-xl mt-2 font-semibold">
                Phí vận chuyển
              </span>
              <span>{`${props.invoice.shippingFee.toLocaleString()}đ`}</span>
              <span className="text-base md_text-xl mt-2 font-semibold">
                Ngày Đặt Hàng
              </span>
              <span>{formatDateTime(`${props.invoice.createdAt}`)}</span>
              {props.invoice.doneAt &&
                props.invoice.status === InvoiceStatus.DONE && (
                  <>
                    <span className="text-base md_text-xl mt-3 font-semibold">
                      Ngày Hoàn Thành
                    </span>
                    <span>{formatDateTime(`${props.invoice.doneAt}`)}</span>
                  </>
                )}
              {props.invoice.doneAt &&
                props.invoice.status === InvoiceStatus.ABORT && (
                  <>
                    <span className="text-base md_text-xl mt-3 font-semibold">
                      Ngày Hủy
                    </span>
                    <span>{formatDateTime(`${props.invoice.doneAt}`)}</span>
                  </>
                )}
            </div>
          </div>

          <ProductInInvoice
            products={props.invoice.invoiceProducts}
            className="mt-10"
          />

          <div className="pt-4 flex flex-col mlg_flex-row mlg_items-center border-t-2 border-slate-500 border-dashed mlg_justify-between">
            <span>
              <span className="font-semibold mr-4 text-xl md_text-2xl">
                TỔNG TIỀN :
              </span>
              <span className="font-medium text-xl md_text-2xl">{`${invoiceService.getTotalBill(props.invoice).toLocaleString()}đ`}</span>
            </span>
            <span
              className={cn(
                "ml-auto space-x-2 mt-10 mlg_mt-0",
                props.disableAction && "hidden"
              )}
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
              <InvoiceCancelDialog handleConfirm={abortOrder}>
                <Button
                  disabled={invoiceService.getUserButtonDisabled(
                    "cancel",
                    invoiceState
                  )}
                  variant="negative"
                >
                  Hủy đơn hàng
                </Button>
              </InvoiceCancelDialog>
            </span>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailDialog;
