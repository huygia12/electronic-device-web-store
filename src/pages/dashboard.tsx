import { NavLink, useRouteLoaderData } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { InvoiceFullJoin, Statistic, User } from "@/types/api";
import OrderTable from "@/components/admin/order-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FC, useEffect, useMemo, useState } from "react";
import StatisticCard from "@/components/admin/statistic-card";
import {
  ArrowRight,
  DollarSign,
  Inbox,
  ShoppingBag,
  Users,
} from "lucide-react";
import {
  formatDateTime,
  getDayOfMonthString,
  getDateString,
  getNumberGapString,
  getRatioString,
} from "@/utils/helpers";
import { invoiceApis, userApis } from "@/services/apis";
import { InvoiceStatus } from "@/utils/constants";

const ORDERS_LINK = "/admin/invoices";

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "hsl(var(--chart-1))",
  },
  order: {
    label: "Đơn hàng",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const Dashboard: FC = () => {
  const statistic = useRouteLoaderData("dash_board") as Statistic;
  const [invoicesData, setInvoicesData] = useState<InvoiceFullJoin[]>([]);
  const [customersData, setCustomersData] = useState<User[]>([]);
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("revenue");
  const chartData = [
    { date: "2024-04-01", revenue: 222000000, order: 150 },
    { date: "2024-04-02", revenue: 97000000, order: 180 },
    { date: "2024-04-03", revenue: 16700000, order: 120 },
    { date: "2024-04-04", revenue: 24200000, order: 260 },
    { date: "2024-04-05", revenue: 373, order: 290 },
    { date: "2024-04-06", revenue: 301, order: 340 },
    { date: "2024-04-07", revenue: 245, order: 180 },
    { date: "2024-04-08", revenue: 409, order: 320 },
  ];

  const total = useMemo(
    () => ({
      revenue: chartData.reduce((acc, curr) => acc + curr.revenue, 0),
      order: chartData.reduce((acc, curr) => acc + curr.order, 0),
    }),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const invoices: InvoiceFullJoin[] = await invoiceApis.getInvoices({
        status: InvoiceStatus.NEW,
        limit: 5,
      });
      const usersRes: User[] = await userApis.getUsers({ recently: true });

      setCustomersData(usersRes);
      setInvoicesData(invoices);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-col py-8">
        {/** 5 Statis Card */}
        <div className="grid grid-cols-4 gap-8 mb-8">
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
            content={`${statistic.products}`}
          />
          <StatisticCard
            name="SỐ TÀI KHOẢN TRÊN HỆ THỐNG"
            icon={Users}
            content={`${statistic.users}`}
          />
        </div>

        {/** Order Preview */}
        {invoicesData.length > 0 && (
          <Card className="rounded-2xl shadow-lg mb-8">
            <CardHeader className="py-6 px-10">
              <CardTitle className="text-8">Đơn hàng cần xác nhận</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col px-6">
              <OrderTable orders={invoicesData} />
            </CardContent>
            <CardFooter className="flex justify-center">
              {invoicesData.length > 0 && (
                <NavLink
                  to={ORDERS_LINK}
                  className="flex text-blue-500 hover_underline"
                >
                  Xem tất cả &nbsp; <ArrowRight />
                </NavLink>
              )}
            </CardFooter>
          </Card>
        )}

        {/** Chart and new customer */}
        <div className="flex space-x-6">
          <Card className="rounded-2xl shadow-lg w-full px-10">
            <CardHeader className="py-6 px-10 flex flex-col items-stretch space-y-0 border-b p-0 sm_flex-row">
              <div className="flex flex-1 flex-col justify-center gap-1 py-5 sm_py-6">
                {activeChart === "revenue" ? (
                  <>
                    <CardTitle>Doanh thu</CardTitle>
                    <CardDescription>
                      Doanh thu từng ngày trong tháng
                    </CardDescription>
                  </>
                ) : (
                  <>
                    <CardTitle>Đơn hàng</CardTitle>
                    <CardDescription>
                      Số đơn hàng từng ngày trong tháng
                    </CardDescription>
                  </>
                )}
              </div>
              <div className="flex">
                {["revenue", "order"].map((key) => {
                  const chart = key as keyof typeof chartConfig;
                  return (
                    <button
                      key={chart}
                      data-active={activeChart === chart}
                      className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even_border-l data-[active=true]_bg-muted/100 sm_border-l sm_border-t-0 sm_px-8 sm_py-6"
                      onClick={() => setActiveChart(chart)}
                    >
                      <span className="text-xs text-muted-foreground">
                        {chartConfig[chart].label}
                      </span>
                      <span className="text-lg font-bold leading-none sm_text-3xl">
                        {total[key as keyof typeof total].toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardHeader>
            <CardContent className="sm_py-16">
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[20rem] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) =>
                      getDayOfMonthString(new Date(value))
                    }
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="min-w-[10rem]"
                        labelFormatter={(value) =>
                          getDateString(new Date(value))
                        }
                      />
                    }
                  />
                  <Bar
                    dataKey={activeChart}
                    fill={`var(--color-${activeChart})`}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/** New customer */}
          {customersData.length > 0 && (
            <Card className="rounded-2xl shadow-lg w-[40%]">
              <CardHeader className="py-6 px-10">
                <CardTitle className="text-8">Khách hàng mới</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col pb-4 px-0">
                <ScrollArea className="h-[20rem] px-4">
                  {customersData.map((customer, index) => {
                    return (
                      <Card key={index} className="mb-4 flex flex-row py-4">
                        <CardHeader className="p-4">
                          <Avatar>
                            <AvatarImage src={customer.avatar || undefined} />
                            <AvatarFallback>avt</AvatarFallback>
                          </Avatar>
                        </CardHeader>
                        <CardContent className="col-span-3 p-0 w-full max-w-60 h-full my-auto">
                          <div className="font-extrabold text-[1.1rem] truncate">
                            {customer.userName}
                          </div>
                          {`Đã gia nhập ${formatDateTime(`${customer.createdAt}`)}`}
                        </CardContent>
                        <CardFooter className="p-0 px-5 flex">
                          <NavLink to="#">
                            <Button
                              variant="neutral"
                              className=" w-[6.2rem] h-[2rem] !text-sm !rounded-full hover_underline"
                            >
                              Xem chi tiết
                            </Button>
                          </NavLink>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
