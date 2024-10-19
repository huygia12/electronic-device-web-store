import { LiaShippingFastSolid } from "react-icons/lia";
import { FiShoppingBag } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { AlignJustify, PackageSearch } from "lucide-react";
import { useAuth, useBlink, useCartProps, useCustomNavigate } from "@/hooks";
import { toast } from "sonner";
import { CounterLabel } from "@/components/user";
import { Role } from "@/types/enum";
import { DropMenuLinkItem, DropdownAvatar } from "@/components/common";
import { FC } from "react";
import useCurrentUser from "@/hooks/use-current-user";
import SearchBar from "@/components/user/search-bar";
import useMyInvoice from "@/hooks/use-invoice";

const navComponents: { title: string; path: string }[] = [
  { title: "Trang Chủ", path: "/" },
  { title: "Giới Thiệu", path: "#footer" },
  { title: "Liên Hệ", path: "#footer" },
];

const AppClientHeader: FC = () => {
  const { itemsInLocal } = useCartProps();
  const { logout } = useAuth();
  const { currentUser } = useCurrentUser();
  const { navigate, location } = useCustomNavigate();
  const { makeBlink } = useBlink();
  const { numberOfShippingInvoice } = useMyInvoice();

  const handleGoToMenu = () => {
    const targetPath = "/";

    if (location.pathname === targetPath) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(`${targetPath}?toCategory=${true}`);
    }
    makeBlink();
  };

  return (
    <header className="w-full flex flex-col sticky top-0 z-50 shadow-xl">
      {/** UPPER */}
      <div className="flex justify-around bg-third">
        <div className="flex justify-between w-myLayout text-[0.8rem] py-2">
          <span className="flex items-center ">
            <TfiHeadphoneAlt className="pr-2" size={20} />
            Gọi mua hàng: &nbsp;
            <b> Hà Nội: 0773.341.*** (8h-21h)</b>
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

      {/** UNDER */}
      <div className="bg-theme h-[5rem] shadow-md flex justify-center ">
        <div className="w-myLayout items-center grid grid-cols-10">
          {/** WEBSITE LOGO */}
          <NavLink to="/" className="col-span-2" unstable_viewTransition>
            <img src="/logo.svg.png" alt="logo" className="h-12" />
          </NavLink>

          {/** SEARCH BAR AND OTHERS */}
          <div className="col-span-6 grid grid-cols-6 items-center">
            <button
              onClick={handleGoToMenu}
              className="w-36 bg-theme-softer text-gray-700 rounded-md px-2 flex h-10 items-center hover_bg-yellow-400"
            >
              <AlignJustify className="mr-4" /> Danh Mục
            </button>

            <SearchBar className="ml-10 col-span-3" />

            <div className="col-span-2 flex flex-row items-center space-x-[2rem] ml-20">
              <NavLink
                to="/cart/view"
                className="relative"
                unstable_viewTransition
              >
                <FiShoppingBag size={36} />
                <CounterLabel counter={itemsInLocal.length} />
              </NavLink>
              {currentUser && (
                <NavLink
                  to={`/users/${currentUser.userID}/orders`}
                  className="relative"
                  unstable_viewTransition
                >
                  <LiaShippingFastSolid size={42} />
                  <CounterLabel counter={numberOfShippingInvoice} />
                </NavLink>
              )}
              <NavLink
                to="/lookup"
                className="relative"
                unstable_viewTransition
              >
                <PackageSearch size={38} />
              </NavLink>
            </div>
          </div>

          {/** USER DROP DOWN MENU */}
          {currentUser ? (
            <DropdownAvatar className="ml-auto col-span-2">
              <DropMenuLinkItem
                item={{
                  name: "Tài Khoản Của Tôi",
                  src: `/users/${currentUser.userID}`,
                  visible: true,
                }}
              />
              <DropMenuLinkItem
                item={{
                  name: "Admin page",
                  src: "/admin",
                  visible: currentUser?.role === Role.ADMIN ? true : false,
                }}
              />
              <DropMenuLinkItem
                item={{
                  name: "Đăng Xuất",
                  visible: true,
                  handleClick: async () => {
                    const promise = logout();
                    toast.promise(promise, {
                      loading: "Đăng xuất...",
                      success: "Đăng xuất thành công!",
                    });
                  },
                }}
              />
            </DropdownAvatar>
          ) : (
            <div className="space-x-2 text-[1.1rem] flex justify-end">
              <NavLink
                className="hover_text-primary-foreground hover_font-semibold"
                to="/login"
                unstable_viewTransition={true}
              >
                Đăng nhập
              </NavLink>
              <span>/</span>
              <NavLink
                className="hover_text-primary-foreground hover_font-semibold"
                to="/signup"
                unstable_viewTransition={true}
              >
                Đăng ký
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppClientHeader;
