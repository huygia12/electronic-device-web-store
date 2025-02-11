import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { invoiceService } from "@/services";
import { Invoice } from "@/types/model";
import {
  formatDateTime,
  getInvoicePaymentMethod,
  getInvoiceStatus,
} from "@/utils/helpers";
import { FC, FormEventHandler, useState } from "react";
import { toast } from "sonner";

const InvoiceLookup: FC = () => {
  const [invoice, setInvoice] = useState<Invoice>();
  const [searchText, setSearchText] = useState<string>();

  const handleSearch: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!searchText) return;

    const getInvoice = invoiceService.apis.getInvoice(searchText.trim());

    toast.promise(getInvoice, {
      loading: "Đang xử lý...",
      success: (result: Invoice) => {
        setInvoice(result);

        return "Đã tìm thấy đơn hàng!";
      },
      error: "Không tìm thấy đơn hàng!",
    });
  };

  return (
    <div>
      <h1 className="text-[1.8rem] font-semibold text-center mb-8 px-10">
        Tra Cứu Trạng Thái Đơn Hàng
      </h1>
      <form className="w-[80vw] mlg_w-[50rem] mx-auto" onSubmit={handleSearch}>
        <Label htmlFor="invoice_id" className="font-semibold text-base">
          Mã Đơn Hàng
        </Label>
        <Input
          id="invoice_id"
          type="text"
          min={1}
          className="mt-2 mb-4 text-base"
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button
          disabled={searchText?.length === 0}
          variant="negative"
          type="submit"
        >
          Tra cứu
        </Button>
      </form>

      {invoice ? (
        <div className="space-y-2 rounded-md border-2 border-stone-200 px-2 py-4 w-[80vw] text-sm xs_text-base xs_p-10 mlg_w-[50rem] mx-auto shadow-lg mt-14">
          <h2 className="text-center !text-xl font-semibold mb-8">
            Thông tin đơn hàng
          </h2>
          <div className="flex justify-between">
            <span className="font-semibold">Khách Hàng</span>
            <span className="text-end">{invoice.userName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Ngày Đặt Hàng</span>
            <span className="text-end">
              {formatDateTime(`${invoice.createdAt}`)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Số Sản Phẩm</span>
            <span className="text-end">
              {invoice.invoiceProducts.length} sản phẩm
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Phương Thức Thanh Toán</span>
            <span className="text-end">
              {getInvoicePaymentMethod(invoice.payment)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Trạng Thái</span>
            <span className="text-end">{getInvoiceStatus(invoice.status)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Phí Vận Chuyển</span>
            <span className="text-end">{`${invoice.shippingFee.toLocaleString()}đ`}</span>
          </div>
          {invoice.doneAt && (
            <div className="flex justify-between">
              <span className="font-semibold">Ngày Hoàn Thành</span>
              <span className="text-end">
                {formatDateTime(`${invoice.doneAt}`)}
              </span>
            </div>
          )}
          {invoice.note && (
            <div className="flex justify-between">
              <span className="font-semibold">Ghi Chú</span>
              <span>{formatDateTime(`${invoice.note}`)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-semibold">Nơi Giao Hàng</span>
            <span className="flex flex-col items-end md_flex-row">
              <span>{`${invoice.ward},`} </span>
              <span>{`${invoice.district},`}</span>
              <span>{`${invoice.province}`}</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img width={400} src="/searching-data.svg" alt="emptyCart" />
        </div>
      )}
    </div>
  );
};

export default InvoiceLookup;
