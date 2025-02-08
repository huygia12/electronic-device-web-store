import { useAuth, useCurrentUser } from "@/hooks";
import { HTMLAttributes } from "react";
import { NavLink } from "react-router-dom";
import { DropdownAvatar, DropMenuLinkItem } from "../common";
import { InvoiceStatus, Role } from "@/types/enum";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UserDropDownMenuProps extends HTMLAttributes<HTMLDivElement> {}

const UserDropDownMenu: React.FC<UserDropDownMenuProps> = ({
  className,
  ...props
}) => {
  const { logout } = useAuth();
  const { currentUser } = useCurrentUser();

  if (!currentUser) {
    return (
      <div className={cn("space-x-2 text-[1.1rem] flex", className)}>
        <NavLink
          className="hover_text-primary-foreground hover_font-semibold text-nowrap"
          to="/login"
          unstable_viewTransition={true}
        >
          Đăng Nhập
        </NavLink>
        <span>/</span>
        <NavLink
          className="hover_text-primary-foreground hover_font-semibold text-nowrap"
          to="/signup"
          unstable_viewTransition={true}
        >
          Đăng Ký
        </NavLink>
      </div>
    );
  }

  return (
    <DropdownAvatar className={cn(className)}>
      <DropMenuLinkItem
        item={{
          name: "Tài Khoản Của Tôi",
          src: `/users/${currentUser.userID}`,
          visible: true,
        }}
      />
      <DropMenuLinkItem
        item={{
          name: "Đơn Hàng Của Tôi",
          src: `/users/${currentUser.userID}/orders?status=${InvoiceStatus.NEW}`,
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
  );
};

export default UserDropDownMenu;
