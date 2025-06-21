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
    <div className="flex flex-col py-8 mx-auto w-[90vw] lgg_w-md lg_w-lg xl_w-xl 2xl_w-2xl 4xl_w-3xl">
      {/** 5 Statistic Card */}
      <div className="grid grid-cols-2 lg_grid-cols-4 gap-4 mb-8">
        <StatisticCard
          name="DOANH THU"
          icon={DollarSign}
          xs_text-sm
          content={statistic.revenue.today.toLocaleString() + "đ"}
          subContent={
            statistic.revenue.yesterday
              ? getRatioString(
                  statistic.revenue.today,
                  statistic.revenue.yesterday
                ) + " so với ngày hôm qua"
              : ``
          }
        />
        <StatisticCard
          name="ĐƠN HÀNG"
          icon={ShoppingBag}
          content={`${statistic.invoices.today}`}
          subContent={
            statistic.invoices.yesterday
              ? getNumberGapString(
                  statistic.invoices.today,
                  statistic.invoices.yesterday
                ) + " so với ngày hôm qua"
              : ``
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
          <CardHeader className="px-6 py-2 md_py-6">
            <CardTitle className="text-lg md_text-2xl">
              Đơn hàng cần xác nhận
            </CardTitle>
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
              className="flex text-blue-500 text-xs md_text-base hover_underline"
            >
              Xem tất cả &nbsp; <ArrowRight className="size-4 md_size-6" />
            </NavLink>
          </CardFooter>
        </Card>
      )}

      <div className="flex gap-6 flex-col-reverse lgg_flex-row">
        {/** Chart */}
        <StatisticChart invoiceStatistic={statistic.invoiceStatistic} />

        {/** New customer */}
        <NewCustomerTable
          newCustomers={statistic.newUsers}
          className="lgg_w-[40%]"
        />
      </div>
    </div>
  );
};

export default Dashboard;
