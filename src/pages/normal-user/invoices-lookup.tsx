import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { invoiceService } from "@/services";
import { Invoice } from "@/types/model";
import { formatDateTime, getInvoiceStatus } from "@/utils/helpers";
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
      <h1 className="text-[1.8rem] font-semibold text-center mb-8">
        Tra Cứu Trạng Thái Đơn Hàng
      </h1>
      <form className="max-w-[50rem] mx-auto" onSubmit={handleSearch}>
        <Label htmlFor="invoice_id" className="font-semibold text-[1rem]">
          Mã Đơn Hàng
        </Label>
        <Input
          id="invoice_id"
          type="text"
          min={1}
          className="mt-2 mb-4 text-[1rem]"
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
        <div className="space-y-2 rounded-md border-2 border-stone-200 p-10 pt-5 max-w-[50rem] mx-auto shadow-lg mt-14">
          <h2 className="text-center text-xl font-semibold mb-8">
            Thông tin đơn hàng
          </h2>
          <div className="flex justify-between">
            <span>Mã Đơn Hàng</span>
            <span>{invoice.invoiceID}</span>
          </div>
          <div className="flex justify-between">
            <span>Khách Hàng</span>
            <span>{invoice.userName}</span>
          </div>
          <div className="flex justify-between">
            <span>Ngày Đặt Hàng</span>
            <span>{formatDateTime(`${invoice.createdAt}`)}</span>
          </div>
          <div className="flex justify-between">
            <span>Trạng Thái</span>
            <span>{getInvoiceStatus(invoice.status)}</span>
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
