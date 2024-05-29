import {
  ArrowRight,
  DollarSign,
  HandCoins,
  Inbox,
  ShoppingBag,
  Users,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { NavLink } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BriefOrderAttributes, ChartData } from "@/declare";
import OrderTable from "@/components/orderTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CustomLineChart from "@/components/customLineChart";

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

const invoices: BriefOrderAttributes[] = [
  {
    customer: "Bùi Minh Khánh",
    id: "011",
    createdAt: new Date(2024, 5, 15, 18, 0, 5),
    products: 3,
    total: 4000000,
    status: "Chờ xác nhận",
  },
];

const newCustomers = [
  {
    customer: "Đặng Thị Ngọc Huyền",
    avt: "/avt.jpg",
    createdAt: new Date(2024, 5, 6, 12, 12, 55),
  },
  {
    customer: "Đặng Thị Ngọc Huyền",
    avt: "/avt.jpg",
    createdAt: new Date(2024, 5, 6, 12, 12, 55),
  },
  {
    customer: "Đặng Thị Ngọc Huyền",
    avt: "/avt.jpg",
    createdAt: new Date(2024, 5, 6, 12, 12, 55),
  },
  {
    customer: "Đặng Thị Ngọc Huyền",
    avt: "/avt.jpg",
    createdAt: new Date(2024, 5, 6, 12, 12, 55),
  },
  {
    customer: "Đặng Thị Ngọc Huyền",
    avt: "/avt.jpg",
    createdAt: new Date(2024, 5, 6, 12, 12, 55),
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
  return (
    <div className="flex flex-col px-14 pb-8">
      <header className="flex h-14 items-center border-b">
        <Breadcrumb className="md_flex p-10">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink to="#">Dashboard</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div> */}
      </header>

      {/** 5 Statis Card */}
      <div className="grid grid-cols-5 space-x-5 my-8">
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
          <OrderTable orders={invoices} />
        </CardContent>
        <CardFooter className="flex justify-center">
          <NavLink
            to="/admin/order"
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
              {newCustomers.map((customer, index) => {
                return (
                  <Card key={index} className="mb-4 flex flex-row ">
                    <CardHeader className="p-4">
                      <Avatar>
                        <AvatarImage src={customer.avt} />
                        <AvatarFallback>avt</AvatarFallback>
                      </Avatar>
                    </CardHeader>
                    <CardContent className="col-span-3 p-0 w-full h-full my-auto">
                      <div className="font-extrabold text-[1.2rem]">
                        {customer.customer}
                      </div>
                      {`Đã gia nhập ngày ${customer.createdAt.toLocaleDateString()}`}
                    </CardContent>
                    <CardFooter className="p-0 px-5 flex">
                      <NavLink to="#">
                        <Badge className="bg-blue-500 text-white w-[6.2rem] h-[2rem] hover_bg-blue-400 hover_underline">
                          Xem chi tiết
                        </Badge>
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
  );
};

export default Dashboard;
