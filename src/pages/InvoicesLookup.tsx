import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Invoice } from "@/declare";
import { useState } from "react";

const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const InvoicesLookup = () => {
  const [searchingResult] = useState<Invoice | undefined>();

  return (
    <>
      <h1 className="text-[1.8rem] font-semibold text-center mb-8">
        Tra Cứu Trạng Thái Đơn Hàng
      </h1>
      <form
        className="max-w-[50rem] mx-auto"
        onSubmit={(e) => handleSubmitForm(e)}
      >
        <Label htmlFor="invoice_id" className="font-semibold text-[1rem]">
          Mã Đơn Hàng
        </Label>
        <Input
          id="invoice_id"
          type="text"
          min={1}
          className="mt-2 mb-4 text-[1rem]"
        />
        <Button variant="negative" type="submit">
          Tra cứu
        </Button>
      </form>
      {searchingResult ? (
        <div className="space-y-2 rounded-md border-2 border-stone-200 p-10 pt-5 max-w-[50rem] mx-auto shadow-lg mt-14">
          <h2 className="text-center text-xl font-semibold mb-8">
            Thông tin đơn hàng
          </h2>
          <div className="flex justify-between">
            <span>Mã Đơn Hàng</span>
            <span>{searchingResult.invoiceID}</span>
          </div>
          <div className="flex justify-between">
            <span>Khách Hàng</span>
            <span>{searchingResult.userName}</span>
          </div>
          <div className="flex justify-between">
            <span>Ngày Đặt Hàng</span>
            <span>{`${searchingResult.createdAt}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Trạng Thái</span>
            <span>{searchingResult.status}</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img width={400} src="/searching-data.svg" alt="emptyCart" />
        </div>
      )}
    </>
  );
};

export default InvoicesLookup;
