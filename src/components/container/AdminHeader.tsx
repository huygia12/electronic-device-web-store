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
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { NavLink } from "react-router-dom";

// const navItems: { name: string; url: string; icon: JSX.Element }[] = [
const navItems = [
  {
    name: "Dash board",
    url: "/admin",
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: "Quản lý người dùng",
    url: "/admin/user",
    icon: <Users2 className="h-5 w-5" />,
  },
  {
    name: "Quản lý danh muc",
    url: "/admin/category",
    icon: <Shapes className="h-5 w-5" />,
  },
  {
    name: "Quản lý sản phẩm",
    url: "/admin/product",
    icon: <Package2 className="h-5 w-5" />,
  },
  {
    name: "Đơn hàng",
    url: "/admin/order",
    icon: <PackageSearch className="h-5 w-5" />,
  },
  {
    name: "Đánh giá",
    url: "/admin/review",
    icon: <MessageSquareCode className="h-5 w-5" />,
  },
  {
    name: "Thống kê",
    url: "/admin/statis",
    icon: <LineChart className="h-5 w-5" />,
  },
  {
    name: "Cửa hàng",
    url: "/admin/store",
    icon: <Store className="h-5 w-5" />,
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
              {navItems.map((item, index) => {
                return (
                  <SheetClose asChild key={index}>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover_text-primary-foreground"
                    >
                      {item.icon}
                      {item.name}
                    </NavLink>
                  </SheetClose>
                );
              })}
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
