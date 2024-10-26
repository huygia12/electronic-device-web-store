import { NavLink, useRouteLoaderData } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Invoice } from "@/types/model";
import { Statistic } from "@/types/payload";
import OrderTable from "@/components/admin/order-table";
import { FC, useState } from "react";
import {
  ArrowRight,
  DollarSign,
  Inbox,
  ShoppingBag,
  Users,
} from "lucide-react";
import { getNumberGapString, getRatioString } from "@/utils/helpers";
import {
  NewCustomerTable,
  StatisticCard,
  StatisticChart,
} from "@/components/dash-board";
import { invoiceService } from "@/services";
import { InvoiceStatus } from "@/types/enum";

const ORDERS_LINK = "/admin/invoices";

const Dashboard: FC = () => {
  const statistic = useRouteLoaderData("dash_board") as Statistic;
  const [orders, setOrders] = useState<Invoice[]>(statistic.orders);

  return (
    <div className="flex flex-col py-8">
      {/** 5 Statistic Card */}
      <div className="grid grid-cols-2 lg_grid-cols-4 gap-4 mb-8">
        <StatisticCard
          name="DOANH THU"
          icon={DollarSign}
          content={statistic.revenue.today.toLocaleString() + "đ"}
          subContent={
            getRatioString(
              statistic.revenue.today,
              statistic.revenue.yesterday
            ) + " so với ngày hôm qua"
          }
        />
        <StatisticCard
          name="ĐƠN HÀNG"
          icon={ShoppingBag}
          content={`${statistic.invoices.today}`}
          subContent={
            getNumberGapString(
              statistic.invoices.today,
              statistic.invoices.yesterday
            ) + " so với ngày hôm qua"
          }
        />
        <StatisticCard
          name="SỐ  MẶT HÀNG ĐANG BÁN"
          icon={Inbox}
          content={`${statistic.totalProducts}`}
        />
        <StatisticCard
          name="SỐ TÀI KHOẢN TRÊN HỆ THỐNG"
          icon={Users}
          content={`${statistic.totalUsers}`}
        />
      </div>

      {/** Order Preview */}
      {statistic.orders.length > 0 && (
        <Card className="rounded-2xl shadow-lg mb-8">
          <CardHeader className="py-6 px-6">
            <CardTitle className="text-8">Đơn hàng cần xác nhận</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <OrderTable
              orders={invoiceService.getInvoiceAfterFilterStatus(
                orders,
                InvoiceStatus.NEW
              )}
              setOrders={setOrders}
              className="max-h-[40vh]"
            />
          </CardContent>
          <CardFooter className="flex justify-center">
            <NavLink
              to={ORDERS_LINK}
              className="flex text-blue-500 hover_underline"
            >
              Xem tất cả &nbsp; <ArrowRight />
            </NavLink>
          </CardFooter>
        </Card>
      )}

      <div className="flex space-x-6">
        {/** Chart */}
        <StatisticChart invoiceStatistic={statistic.invoiceStatistic} />

        {/** New customer */}
        <NewCustomerTable newCustomers={statistic.newUsers} />
      </div>
    </div>
  );
};

export default Dashboard;
