import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Invoice, User } from "@/types/api";
import OrderTable from "@/components/admin/order-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FC, useEffect, useState } from "react";
import axios from "axios";
import { axiosInstance } from "@/services/axios";
import { cardItem, revenueData } from "./data";
import { CustomLineChart } from "@/components/common";

const ORDERS_LINK = "/admin/orders";

const Dashboard: FC = () => {
  const [ordersData, setOrdersData] = useState<Invoice[]>([]);
  const [customersData, setCustomersData] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await axiosInstance.get<Invoice[]>("/invoices");
        const usersRes = await axiosInstance.get<User[]>("/users");

        setCustomersData(usersRes.data);
        setOrdersData(ordersRes.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // AxiosError-specific handling
          console.error("Axios error:", error.message);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
          }
        } else {
          // General error handling
          console.error("Unexpected error:", error);
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
                  <span className="place-items-start">
                    <item.icon />
                  </span>
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
                          <AvatarImage src={customer.avatar || undefined} />
                          <AvatarFallback>avt</AvatarFallback>
                        </Avatar>
                      </CardHeader>
                      <CardContent className="col-span-3 p-0 w-full max-w-60 h-full my-auto">
                        <div className="font-extrabold text-[1.1rem] truncate">
                          {customer.userName}
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
