import { Input } from "@/components/ui/input";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FiShoppingBag } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import CounterLabel from "@/components/ui/counterLabel";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import CustomAvt from "../ui/customAvt";
import { PackageSearch, Search } from "lucide-react";
import { useCartProps, useCurrAccount } from "@/utils/customHook";
import { axiosInstance, reqConfig } from "@/utils/axiosConfig";
import { publicRoutes } from "@/pages/routes";
import log from "loglevel";
import { useRef } from "react";
import { toast } from "sonner";

const navComponents: { title: string; path: string }[] = [
  { title: "Trang Chủ", path: "/" },
  { title: "Giới Thiệu", path: "/intro" },
  { title: "Liên Hệ", path: "#footer" },
];

const AppClientHeader = () => {
  const { itemsInLocal } = useCartProps();
  const { currAccount, clearCurrAccount } = useCurrAccount();

  const userOptions = useRef([
    {
      name: "Tài Khoản Của Tôi",
      src: "/profile",
    },
    {
      name: "Đăng Xuất",
      handleClick: async () => {
        console.log("run useref");
        try {
          await axiosInstance.delete("/user/logout", reqConfig);

          toast.success("Đăng xuất thành công!");
          clearCurrAccount();
          await publicRoutes.navigate("/login", {
            unstable_viewTransition: true,
          });
        } catch (error: unknown) {
          log.warn(`Response data: ${error}`);
        }
      },
    },
  ]);

  return (
    <header className="w-full flex flex-col sticky top-0 z-50 shadow-xl">
      <div className="flex justify-around bg-third">
        <div className="flex justify-between w-myLayout text-[0.8rem] py-2">
          <span className="flex items-center ">
            <TfiHeadphoneAlt className="pr-2" size={20} />
            Gọi mua hàng: &nbsp;
            <b> Hà Nội: 0388.725.928 (8h-21h)</b>
          </span>
          <span>
            {navComponents.map((item, index) => {
              return (
                <a
                  href={item.path}
                  key={index}
                  className="pl-6 hover_text-theme hover_underline"
                >
                  {item.title}
                </a>
              );
            })}
          </span>
        </div>
      </div>
      <div className="bg-theme h-[5rem] shadow-md flex justify-center ">
        <div className="w-myLayout items-center grid grid-cols-5">
          <NavLink to="/" className="mr-20" unstable_viewTransition>
            <img src="/logo.svg.png" alt="logo" className="h-12" />
          </NavLink>
          <div className="col-span-3 grid grid-cols-3 items-center">
            <div className="w-full col-span-2 relative flex-1 md_grow-0 h-[2.7rem]">
              <Search className="absolute left-2.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm..."
                className="h-full text-xl w-full rounded-2xl bg-background pl-8"
              />
            </div>
            <div className="flex flex-row items-center space-x-[2rem] ml-20">
              <NavLink
                to="/cart/view"
                className="relative"
                unstable_viewTransition
              >
                <FiShoppingBag size={40} />
                <CounterLabel counter={itemsInLocal.length} />
              </NavLink>
              {currAccount && (
                <NavLink
                  to="orders"
                  className="relative"
                  unstable_viewTransition
                >
                  <LiaShippingFastSolid size={45} />
                  <CounterLabel counter={6} />
                </NavLink>
              )}
              <NavLink
                to="/lookup"
                className="relative"
                unstable_viewTransition
              >
                <PackageSearch size={40} />
              </NavLink>
            </div>
          </div>
          <CustomAvt className="ml-10" options={userOptions.current} />
        </div>
      </div>
    </header>
  );
};

export default AppClientHeader;
