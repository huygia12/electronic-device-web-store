import { OrderTable } from "@/components/admin";
import { CustomPagination, InvoiceUpperBar } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Invoice } from "@/types/model";
import { FC, useEffect, useRef, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { InvoiceStatus } from "@/types/enum";
import { toast } from "sonner";
import { invoiceService } from "@/services";
import { getPages } from "@/utils/helpers";

const OrderManagement: FC = () => {
  const searchingDelay = useRef<number>(2000);
  const initData = useRouteLoaderData("invoice_management") as {
    invoices: Invoice[];
    totalInvoices: number;
  };
  const [invoices, setInvoices] = useState<Invoice[]>(initData.invoices);
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
        const res: { invoices: Invoice[]; totalInvoices: number } =
          await invoiceService.apis.getInvoices({
            searching: searchText,
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
  }, [searchText, selectedStatus, currentPage]);

  return (
    <div>
      {/** TABLE */}
      <InvoiceUpperBar
        searchPlaceholder="Tìm kiếm theo tên khách hàng..."
        setSelectedStatus={setSelectedStatus}
        setSearchText={setSearchText}
        className="mt-8"
      />

      <Card className="rounded-2xl shadow-lg mt-4 mb-4">
        <CardHeader className="py-6 px-10">
          <CardTitle className="text-8">Quản lý đơn hàng</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-4 h-[60vh]">
          {invoices.length !== 0 ? (
            <OrderTable
              orders={invoiceService.getInvoiceAfterFilterStatus(
                invoices,
                selectedStatus
              )}
              setOrders={setInvoices}
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

export default OrderManagement;
