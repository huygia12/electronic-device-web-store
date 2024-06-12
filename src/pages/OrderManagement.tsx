import OrderTable from "@/components/orderTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Invoice } from "@/declare";
import { useRouteLoaderData } from "react-router-dom";

const OrderManagement = () => {
  const invoiceData = useRouteLoaderData("invoice_management") as Invoice[];

  return (
    <>
      {/** TABLE */}
      <Card className="rounded-2xl shadow-lg mt-8 mb-4">
        <CardHeader className="py-6 px-10">
          <CardTitle className="text-8">Đơn hàng cần xác nhận</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col px-6 pb-4">
          <OrderTable orders={invoiceData} />
        </CardContent>
      </Card>

      {/** PAGINATION */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default OrderManagement;
