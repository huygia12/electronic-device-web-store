import { OrderTable } from "@/components/admin";
import { CustomPagination } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceFullJoin } from "@/types/model";
import { FC, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";

const OrderManagement: FC = () => {
  const invoiceData = useRouteLoaderData(
    "invoice_management"
  ) as InvoiceFullJoin[];
  const [totalPages, setTotalPages] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  console.log(currentPage, setTotalPages);

  return (
    <div>
      {/** TABLE */}
      <Card className="rounded-2xl shadow-lg mt-8 mb-4">
        <CardHeader className="py-6 px-10">
          <CardTitle className="text-8">Quản lý đơn hàng</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-4">
          <OrderTable orders={invoiceData} />
        </CardContent>
      </Card>

      <CustomPagination
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default OrderManagement;
