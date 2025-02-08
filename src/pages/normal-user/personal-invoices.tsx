import { Card, CardContent } from "@/components/ui/card";
import { Invoice } from "@/types/model";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { InvoiceTable } from "@/components/my-invoices";
import { CustomPagination, InvoiceUpperBar } from "@/components/common";
import { getPages } from "@/utils/helpers";
import { InvoiceStatus } from "@/types/enum";
import { invoiceService } from "@/services";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks";

const PersonalInvoices: FC = () => {
  const searchingDelay = useRef<number>(500);
  const initData = useRouteLoaderData("user_invoices") as {
    invoices: Invoice[];
    totalInvoices: number;
  };
  const { currentUser } = useCurrentUser();
  const [invoices, setInvoices] = useState<Invoice[]>(initData.invoices);
  const [totalPages, setTotalPages] = useState<number>(
    getPages(initData.totalInvoices)
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const status: string | null = searchParams.get("status");
    return status ? (status as InvoiceStatus) : InvoiceStatus.PAYMENT_WAITING;
  });
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
            userID: currentUser!.userID,
          });

        setInvoices(res.invoices);
        setTotalPages(getPages(res.totalInvoices));
      } finally {
        toast.dismiss(toasting.current!.id);
        toasting.current = null;
      }
    }, searchingDelay.current);

    return () => clearTimeout(delayDebounceFn);
  }, [currentUser, params]);

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
    editQueryUrl([{ filterKey: "invoiceID", filterValue: `${value}` }]);
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
    <div className="flex flex-col items-center">
      <h1 className="text-[1.8rem] font-semibold text-center mb-2">
        Đơn Hàng Của Bạn
      </h1>
      <InvoiceUpperBar
        searchPlaceholder="Tìm kiếm theo mã đơn hàng..."
        setSelectedStatus={handleStatusSelectionEvent}
        setSearchText={handleSearchTextChange}
        defaultSelectedStatus={selectedStatus}
        className="mt-8 w-[90vw] xl_w-full"
      />

      <Card className="rounded-lg shadow-lg my-4 w-[90vw] xl_w-full">
        <CardContent className="px-6 pb-4 h-[60vh] min-h-fit">
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
        parentPageState={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
};

export default PersonalInvoices;
