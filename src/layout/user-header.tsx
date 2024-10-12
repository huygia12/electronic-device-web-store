import { LiaShippingFastSolid } from "react-icons/lia";
import { FiShoppingBag } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { PackageSearch } from "lucide-react";
import { useAuth, useCartProps } from "@/hooks";
import { toast } from "sonner";
import { AvatarPlaceholder, CounterLabel } from "@/components/user";
import { Role } from "@/types/enum";
import { DropMenuLinkItem, DropdownAvatar } from "@/components/common";
import { FC } from "react";
import useCurrentUser from "@/hooks/use-current-user";
import SearchBar from "@/components/user/search-bar";

const navComponents: { title: string; path: string }[] = [
  { title: "Trang Chủ", path: "/" },
  { title: "Giới Thiệu", path: "/intro" },
  { title: "Liên Hệ", path: "#footer" },
];

const AppClientHeader: FC = () => {
  const { itemsInLocal } = useCartProps();
  const { logout } = useAuth();
  const { currentUser } = useCurrentUser();

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
            <SearchBar />

            <div className="flex flex-row items-center space-x-[2rem] ml-20">
              <NavLink
                to="/cart/view"
                className="relative"
                unstable_viewTransition
              >
                <FiShoppingBag size={40} />
                <CounterLabel counter={itemsInLocal.length} />
              </NavLink>
              {currentUser && (
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
          {currentUser ? (
            <DropdownAvatar className="ml-10">
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
            <AvatarPlaceholder />
          )}
        </div>
      </div>
    </header>
  );
};

export default AppClientHeader;
