import { RiNotification2Fill } from "react-icons/ri";
import { TbCategoryPlus } from "react-icons/tb";
import CounterLabel from "../ui/counterLabel";
import CustomAvt from "../ui/customAvt";
import {
  Home,
  LineChart,
  Package2,
  Users2,
  Shapes,
  PackageSearch,
  MessageSquareCode,
  Store,
  Factory,
  Boxes,
  BadgePercent,
  Tags,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { NavLink } from "react-router-dom";
import AdminAccordion from "../adminAccordion";
import { AdminNavItem } from "@/declare";
import { ScrollArea } from "../ui/scroll-area";

const navItems: AdminNavItem[] = [
  {
    name: "Bảng điều khiển",
    url: "/admin",
    icon: <Home className="h-5 w-5" />,
    hasChild: false,
    children: [],
  },
  {
    name: "Quản lý khách hàng",
    url: "/admin/user",
    icon: <Users2 className="h-5 w-5" />,
    hasChild: false,
    children: [],
  },
  {
    name: "Quản lý danh muc",
    url: "/admin/category",
    icon: <Shapes className="h-5 w-5" />,
    hasChild: false,
    children: [],
  },
  {
    name: "Quản lý nhà phân phối",
    url: "/admin/provider",
    icon: <Factory className="h-5 w-5" />,
    hasChild: false,
    children: [],
  },
  {
    name: "Sản phẩm",
    url: "/admin/product",
    icon: <Package2 className="h-5 w-5" />,
    hasChild: true,
    children: [
      {
        name: "Thêm sản phẩm",
        url: "/admin/product/add",
        icon: <BadgePercent className="h-5 w-5" />,
      },
      {
        name: "Quản lý sản phẩm",
        url: "/admin/product",
        icon: <Boxes className="h-5 w-5" />,
      },
      {
        name: "Thể loại",
        url: "/admin/product/attribute",
        icon: <Tags className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Đơn hàng",
    url: "/admin/order",
    icon: <PackageSearch className="h-5 w-5" />,
    hasChild: false,
    children: [],
  },
  {
    name: "Đánh giá",
    url: "/admin/review",
    icon: <MessageSquareCode className="h-5 w-5" />,
    hasChild: false,
    children: [],
  },
  {
    name: "Thống kê",
    url: "/admin/statis",
    icon: <LineChart className="h-5 w-5" />,
    hasChild: false,
    children: [],
  },
  {
    name: "Cửa hàng",
    url: "/admin/store",
    icon: <Store className="h-5 w-5" />,
    hasChild: false,
    children: [],
  },
];

const AdminHeader = () => {
  return (
    <div className="w-full py-2 flex flex-col sticky top-0 z-50 bg-theme shadow-xl items-center">
      <div className="w-adminLayout flex items-center justify-between">
        {/** NAV BAR */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <TbCategoryPlus size={55} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="max-w-xs">
            <nav className="grid gap-8 text-lg font-medium">
              <div className="group flex h-16 w-16 items-center justify-center rounded-full bg-theme">
                <Package2 className="h-10 w-10 transition-all group-hover_scale-110" />
              </div>
              <ScrollArea className="h-[100vh] px-3">
                {navItems.map((item, index) =>
                  item.hasChild ? (
                    <AdminAccordion key={index} subItems={item.children}>
                      <div className="flex items-center gap-4 px-2.5 text-muted-foreground hover_text-primary-foreground">
                        {item.icon} {item.name}
                      </div>
                    </AdminAccordion>
                  ) : (
                    <div key={index}>
                      <NavLink
                        to={item.url}
                        className="border-b py-4 flex items-center gap-4 px-2.5 text-muted-foreground hover_text-primary-foreground"
                      >
                        {item.icon} {item.name}
                      </NavLink>
                    </div>
                  )
                )}
              </ScrollArea>
            </nav>
          </SheetContent>
        </Sheet>

        {/** NOTIFICATION AND AVATAR */}
        <div className="flex items-center">
          <div className="relative">
            <RiNotification2Fill size={34} />
            <CounterLabel
              counter={6}
              className="left-[-0.9rem] top-[-1.1rem]"
            />
          </div>
          <CustomAvt avt="/avt.jpg" name="Admin" alt="ad" className="ml-10" />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
