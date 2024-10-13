import { Card, CardContent } from "@/components/ui/card";
import { InvoiceFullJoin } from "@/types/model";
import { FC, useEffect, useRef, useState } from "react";
import { useRouteLoaderData, useSearchParams } from "react-router-dom";
import { InvoiceTable } from "@/components/my-invoices";
import { CustomPagination, InvoiceUpperBar } from "@/components/common";
import { getPages } from "@/utils/helpers";
import { InvoiceStatus } from "@/types/enum";
import { invoiceService } from "@/services";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks";

const PersonalInvoices: FC = () => {
  const searchingDelay = useRef<number>(2000);
  const initData = useRouteLoaderData("user_invoices") as {
    invoices: InvoiceFullJoin[];
    totalInvoices: number;
  };
  const { currentUser } = useCurrentUser();
  const [searchParams] = useSearchParams();
  const [invoices, setInvoices] = useState<InvoiceFullJoin[]>(
    initData.invoices
  );
  const [totalPages, setTotalPages] = useState<number>(
    getPages(initData.totalInvoices)
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus>(
    InvoiceStatus.NEW
  );
  const toasting = useRef<{
    id: string | number;
    state: boolean;
  } | null>();
  const [paidSuccess, setPaidSuccess] = useState<boolean>(false);

  useEffect(() => {
    const checkRoutingParams = async () => {
      const paidInvoiceID: string | null = searchParams.get("paidInvoiceID");
      if (paidInvoiceID) {
        setPaidSuccess(true);
      }
    };

    checkRoutingParams();
  }, [searchParams]);

  useEffect(() => {
    const checkPaid = async () => {
      if (paidSuccess) {
        toast.success("Thanh toán đơn hàng thành công!");
        setPaidSuccess(false);
      }
    };

    checkPaid();
  }, [paidSuccess]);

  useEffect(() => {
    if (toasting.current === undefined) {
      toasting.current = null;
    } else {
      if (!toasting.current?.state) {
        toasting.current = { id: toast.loading("Đang xử lý..."), state: true };
      }
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res: { invoices: InvoiceFullJoin[]; totalInvoices: number } =
          await invoiceService.apis.getInvoices({
            userID: currentUser!.userID,
            invoiceID: searchText,
            currentPage: currentPage,
            status: selectedStatus,
          });

        setInvoices(res.invoices);
        setTotalPages(getPages(res.totalInvoices));
      } finally {
        toast.dismiss(toasting.current!.id);
        toasting.current = null;
      }
    }, searchingDelay.current);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText, selectedStatus, currentPage, currentUser]);

  return (
    <div>
      <h1 className="text-[1.8rem] font-semibold text-center mb-8">
        Đơn Hàng Của Bạn
      </h1>
      <InvoiceUpperBar
        searchPlaceholder="Tìm kiếm theo mã đơn hàng..."
        setSelectedStatus={setSelectedStatus}
        setSearchText={setSearchText}
        className="mt-8"
      />

      <Card className="rounded-2xl shadow-lg mt-4 mb-4">
        <CardContent className="px-6 pb-4 h-[60vh]">
          {invoices.length !== 0 ? (
            <InvoiceTable
              invoices={invoices}
              setInvoices={setInvoices}
              className="h-[60vh]"
            />
          ) : (
            <div className="flex flex-col items-center">
              <img width={500} src="/empty-box.svg" alt="emptyCart" />
              <span className="text-xl font-medium text-slate-500 mb-10">
                Không có đơn hàng nào!
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <CustomPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default PersonalInvoices;
