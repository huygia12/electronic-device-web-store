import { OrderTable } from "@/components/admin";
import { CustomPagination, InvoiceUpperBar } from "@/components/common";
import { Card, CardContent } from "@/components/ui/card";
import { Invoice } from "@/types/model";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { InvoiceStatus } from "@/types/enum";
import { toast } from "sonner";
import { invoiceService } from "@/services";
import { getPages } from "@/utils/helpers";

const InvoiceManagement: FC = () => {
  const searchingDelay = useRef<number>(500);
  const initData = useRouteLoaderData("invoice_management") as {
    invoices: Invoice[];
    totalInvoices: number;
  };
  const [invoices, setInvoices] = useState<Invoice[]>(initData.invoices);
  const [totalPages, setTotalPages] = useState<number>(
    getPages(initData.totalInvoices)
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus>(
    InvoiceStatus.NEW
  );
  const toasting = useRef<{
    id: string | number;
    state: boolean;
  } | null>();
  const [filterChange, setFilterChange] = useState<boolean>(true);
  const params = useMemo(
    () => new URLSearchParams(window.location.search),
    [filterChange]
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const status: string | null = searchParams.get("status");

    if (
      status &&
      Object.keys(InvoiceStatus).includes(status as InvoiceStatus)
    ) {
      setSelectedStatus(status as InvoiceStatus);
    }
  }, []);

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
        const records = Object.fromEntries([...params]);
        const res: { invoices: Invoice[]; totalInvoices: number } =
          await invoiceService.apis.getInvoices({
            ...records,
          });

        setInvoices(res.invoices);
        setTotalPages(getPages(res.totalInvoices));
      } finally {
        toast.dismiss(toasting.current!.id);
        toasting.current = null;
      }
    }, searchingDelay.current);

    return () => clearTimeout(delayDebounceFn);
  }, [params]);

  const handleStatusSelectionEvent = (value: InvoiceStatus) => {
    setCurrentPage(1);
    setSelectedStatus(value);
    editQueryUrl([{ filterKey: "status", filterValue: `${value}` }]);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    editQueryUrl([{ filterKey: "currentPage", filterValue: `${pageNumber}` }]);
  };

  const handleSearchTextChange = (value: string) => {
    setCurrentPage(1);
    editQueryUrl([{ filterKey: "searching", filterValue: `${value}` }]);
  };

  const editQueryUrl = (
    queryParams: {
      filterKey: string;
      filterValue: string | undefined | string[];
    }[]
  ) => {
    const currentUrl = new URL(window.location.href);

    queryParams.forEach((queryParam) => {
      if (queryParam.filterValue) {
        currentUrl.searchParams.set(
          queryParam.filterKey,
          typeof queryParam.filterValue === "string"
            ? queryParam.filterValue
            : queryParam.filterValue.join(",")
        );
      } else {
        currentUrl.searchParams.delete(queryParam.filterKey);
      }
    });

    window.history.replaceState({}, "", currentUrl);
    setFilterChange((prevValue) => !prevValue);
  };

  return (
    <div className="my-8 mx-auto w-[90vw] lgg_max-w-max">
      {/** TABLE */}
      <InvoiceUpperBar
        searchPlaceholder="Tìm kiếm theo tên khách hàng..."
        setSelectedStatus={handleStatusSelectionEvent}
        setSearchText={handleSearchTextChange}
        defaultSelectedStatus={selectedStatus}
      />

      <Card className="rounded-md shadow-lg mt-4 mb-4">
        <CardContent className="h-[60vh] min-h-fit px-0 xs_px-4">
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
              <img width={400} src="/empty-box.svg" alt="emptyCart" />
              <span className="text-center text-base md_text-xl font-medium text-slate-500 mb-10">
                Không có đơn hàng nào!
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <CustomPagination
        parentPageState={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
};

export default InvoiceManagement;
