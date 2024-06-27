import {
  ArrowRight,
  DollarSign,
  HandCoins,
  Inbox,
  ShoppingBag,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Invoice, ChartData, Account } from "@/declare";
import OrderTable from "@/components/orderTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CustomLineChart from "@/components/customLineChart";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import log from "loglevel";
import { axiosInstance } from "@/utils/axiosConfig";

const ORDERS_LINK = "/admin/received-orders";

const cardItem = [
  {
    name: "Doanh thu",
    content: "12.000.000đ",
    subContent: "+20.1% so với hôm qua",
    icon: <DollarSign />,
  },
  {
    name: "Lợi nhuận",
    content: "6.000.000đ",
    subContent: "+20.1% so với hôm qua",
    icon: <HandCoins />,
  },
  {
    name: "Đơn hàng",
    content: "55",
    subContent: "+5 so với hôm qua",
    icon: <ShoppingBag />,
  },
  {
    name: "Số mặt hàng đang bán",
    content: "56",
    subContent: "",
    icon: <Inbox />,
  },
  {
    name: "Người dùng online",
    content: "4",
    subContent: "",
    icon: <Users />,
  },
];

const revenueData: ChartData[] = [
  {
    name: "1/5/2024",
    revenue: 12000000,
  },
  {
    name: "2/5/2004",
    revenue: 4000000,
  },
  {
    name: "3/5/2004",
    revenue: 34000000,
  },
  {
    name: "4/5/2004",
    revenue: 40000000,
  },
  {
    name: "5/5/2004",
    revenue: 33000000,
  },
  {
    name: "6/5/2004",
    revenue: 400000,
  },
  {
    name: "7/5/2004",
    revenue: 41100000,
  },
];

const Dashboard = () => {
  const [ordersData, setOrdersData] = useState<Invoice[]>([]);
  const [customersData, setCustomersData] = useState<Account[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await axiosInstance.get<Invoice[]>("/invoices");
        const usersRes = await axiosInstance.get<Account[]>("/accounts");

        setCustomersData(usersRes.data);
        setOrdersData(ordersRes.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // AxiosError-specific handling
          log.error("Axios error:", error.message);
          if (error.response) {
            log.error("Response data:", error.response.data);
            log.error("Response status:", error.response.status);
          }
        } else {
          // General error handling
          log.error("Unexpected error:", error);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-col py-8">
        {/** 5 Statis Card */}
        <div className="grid grid-cols-5 space-x-5 mb-8">
          {cardItem.map((item, index) => {
            return (
              <Card key={index} className="min-w-[200px] rounded-2xl shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between px-5 pt-4 pb-2">
                  <CardTitle className="text-[1rem] max-w-[80%] truncate ...">
                    {item.name}
                  </CardTitle>
                  <span className="place-items-start">{item.icon}</span>
                </CardHeader>
                <CardContent className="flex flex-col px-6 pb-4">
                  <div className="text-[2rem] font-extrabold truncate ...">
                    {item.content}
                  </div>
                  <div className="max-w truncate ...">{item.subContent}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/** Order Preview */}
        <Card className="rounded-2xl shadow-lg mb-8">
          <CardHeader className="py-6 px-10">
            <CardTitle className="text-8">Đơn hàng cần xác nhận</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col px-6 pb-4">
            <OrderTable orders={ordersData} />
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

        {/** Chart and new customer */}
        <div className="flex space-x-6">
          <Card className="rounded-2xl shadow-lg w-full">
            <CardHeader className="py-6 px-10">
              <CardTitle className="text-8">Biểu đồ danh thu</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col px-6 pb-4">
              <CustomLineChart chartData={revenueData} />
            </CardContent>
          </Card>
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
                          <AvatarImage src={customer.avt} />
                          <AvatarFallback>avt</AvatarFallback>
                        </Avatar>
                      </CardHeader>
                      <CardContent className="col-span-3 p-0 w-full max-w-60 h-full my-auto">
                        <div className="font-extrabold text-[1.1rem] truncate">
                          {customer.accountName}
                        </div>
                        {`Đã gia nhập ngày ${customer.createdAt}`}
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
        </div>
      </div>
    </>
  );
};

export default Dashboard;
