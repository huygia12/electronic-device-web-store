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
import { BriefOrderAttributes } from "@/declare";

const invoices: BriefOrderAttributes[] = [
  {
    customer: "Bùi Minh Khánh",
    id: "011",
    createdAt: new Date(2024, 5, 15, 18, 0, 5),
    products: 3,
    total: 4000000,
    status: "Chờ xác nhận",
  },
  {
    customer: "Bùi Minh Khánh",
    id: "012",
    createdAt: new Date(2024, 5, 15, 18, 0, 5),
    products: 3,
    total: 4000000,
    status: "Chờ xác nhận",
  },
  {
    customer: "Bùi Minh Khánh",
    id: "013",
    createdAt: new Date(2024, 5, 15, 18, 0, 5),
    products: 3,
    total: 4000000,
    status: "Chờ xác nhận",
  },
  {
    customer: "Bùi Minh Khánh",
    id: "014",
    createdAt: new Date(2024, 5, 15, 18, 0, 5),
    products: 3,
    total: 4000000,
    status: "Chờ xác nhận",
  },
  {
    customer: "Bùi Minh Khánh",
    id: "015",
    createdAt: new Date(2024, 5, 15, 18, 0, 5),
    products: 3,
    total: 4000000,
    status: "Chờ xác nhận",
  },
  {
    customer: "Bùi Minh Khánh",
    id: "016",
    createdAt: new Date(2024, 5, 15, 18, 0, 5),
    products: 3,
    total: 4000000,
    status: "Chờ xác nhận",
  },
  {
    customer: "Bùi Minh Khánh",
    id: "017",
    createdAt: new Date(2024, 5, 15, 18, 0, 5),
    products: 3,
    total: 4000000,
    status: "Chờ xác nhận",
  },
  {
    customer: "Bùi Minh Khánh",
    id: "018",
    createdAt: new Date(2024, 5, 15, 18, 0, 5),
    products: 3,
    total: 4000000,
    status: "Chờ xác nhận",
  },
  {
    customer: "Bùi Minh Khánh",
    id: "019",
    createdAt: new Date(2024, 5, 15, 18, 0, 5),
    products: 3,
    total: 4000000,
    status: "Chờ xác nhận",
  },
  {
    customer: "Bùi Minh Khánh",
    id: "020",
    createdAt: new Date(2024, 5, 15, 18, 0, 5),
    products: 3,
    total: 4000000,
    status: "Chờ xác nhận",
  },
];

const OrderManagement = () => {
  return (
    <>
      {/** Table */}
      <Card className="rounded-2xl shadow-lg mt-8 mb-4">
        <CardHeader className="py-6 px-10">
          <CardTitle className="text-8">Đơn hàng cần xác nhận</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col px-6 pb-4">
          <OrderTable orders={invoices} />
        </CardContent>
      </Card>

      {/** Pagination */}
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
