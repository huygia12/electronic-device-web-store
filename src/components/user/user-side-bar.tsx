import { HTMLAttributes } from "react";
import { NavLink } from "react-router-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  AlignJustify,
  Home,
  LogOut,
  User,
  UserCog,
  WalletCards,
  SquareUser,
  UserPlus,
  PackageSearch,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth, useCurrentUser, useCustomNavigate } from "@/hooks";
import { InvoiceStatus, Role } from "@/types/enum";
import { toast } from "sonner";

interface UserSideBarProps extends HTMLAttributes<HTMLDivElement> {}

const UserSideBar: React.FC<UserSideBarProps> = ({ className }) => {
  const { currentUser } = useCurrentUser();
  const { logout } = useAuth();
  const { navigate } = useCustomNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={cn(className, "w-fit")}>
          <AlignJustify size={40} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="max-w-xs">
        <nav className="grid gap-8 text-lg font-medium">
          <div className="flex items-center gap-2">
            <Avatar className="h-max w-max focus-visible_!outline-none ">
              <AvatarImage
                src={currentUser?.avatar || undefined}
                alt="AVT"
                className="focus-visible_!outline-none size-14"
              />
              <AvatarFallback className="text-stone-800 hover_border-4 hover_border-primary hover_bg-primary-softer hover_text-primary focus-visible_outline-none">
                <User size={40} />
              </AvatarFallback>
            </Avatar>
            {currentUser ? (
              <span className="font-semibold max-w-48 text-[1.2rem] truncate ">
                {currentUser?.userName}
              </span>
            ) : (
              <SheetClose className="space-x-2 text-[1.1rem] mr-auto ml-2 flex flex-col xs_flex-row ">
                <span
                  className="hover_text-primary-foreground hover_font-semibold hover_underline"
                  onClick={() =>
                    navigate("/login", {
                      unstable_viewTransition: true,
                    })
                  }
                >
                  Đăng Nhập
                </span>
              </SheetClose>
            )}
          </div>
          <ScrollArea className="h-[100vh] px-3">
            <NavLink
              to="/"
              className="flex text-[0.9rem] md_text-[1.1rem] border-b py-4 px-2.5"
            >
              <SheetClose className="flex items-center gap-2 text-muted-foreground hover_text-primary-foreground">
                <span>
                  <Home className="h-5 w-5" />
                </span>
                <span className="text-nowrap">Trang chủ</span>
              </SheetClose>
            </NavLink>
            {currentUser ? (
              <>
                <NavLink
                  to={`/users/${currentUser.userID}`}
                  className="flex text-[0.9rem] md_text-[1.1rem] border-b py-4 px-2.5"
                >
                  <SheetClose className="flex items-center gap-2 text-muted-foreground hover_text-primary-foreground">
                    <span>
                      <SquareUser className="h-5 w-5" />
                    </span>
                    <span className="text-nowrap">Tài Khoản Của Tôi</span>
                  </SheetClose>
                </NavLink>
                <NavLink
                  to={`/users/${currentUser.userID}/orders?status=${InvoiceStatus.NEW}`}
                  className="flex text-[0.9rem] md_text-[1.1rem] border-b py-4 px-2.5"
                >
                  <SheetClose className="flex items-center gap-2 text-muted-foreground hover_text-primary-foreground">
                    <span>
                      <WalletCards className="h-5 w-5" />
                    </span>
                    <span className="text-nowrap">Đơn Hàng Của Tôi</span>
                  </SheetClose>
                </NavLink>
                {currentUser.role === Role.ADMIN ? (
                  <NavLink
                    to="/admin"
                    className="flex text-[0.9rem] md_text-[1.1rem] border-b py-4 px-2.5"
                  >
                    <SheetClose className="flex items-center gap-2 text-muted-foreground hover_text-primary-foreground">
                      <span>
                        <UserCog className="h-5 w-5" />
                      </span>
                      <span className="text-nowrap">Admin Page</span>
                    </SheetClose>
                  </NavLink>
                ) : undefined}
                <SheetClose className="text-[0.9rem] md_text-[1.1rem] border-b w-full py-4 px-2.5 flex items-center gap-2 text-muted-foreground hover_text-primary-foreground">
                  <span>
                    <LogOut className="h-5 w-5" />
                  </span>
                  <span
                    className="text-nowrap"
                    onClick={async () => {
                      const promise = logout();
                      toast.promise(promise, {
                        loading: "Đăng xuất...",
                        success: "Đăng xuất thành công!",
                      });
                    }}
                  >
                    Đăng Xuất
                  </span>
                </SheetClose>
              </>
            ) : (
              <>
                <SheetClose className="text-[0.9rem] md_text-[1.1rem] border-b w-full py-4 px-2.5 flex items-center gap-2 text-muted-foreground hover_text-primary-foreground">
                  <span>
                    <PackageSearch className="size-6" />
                  </span>
                  <span
                    className="hover_text-primary-foreground hover_font-semibold text-nowrap"
                    onClick={() =>
                      navigate("/lookup", {
                        unstable_viewTransition: true,
                      })
                    }
                  >
                    Tra Đơn Hàng
                  </span>
                </SheetClose>
                <SheetClose className="text-[0.9rem] md_text-[1.1rem] border-b w-full py-4 px-2.5 flex items-center gap-2 text-muted-foreground hover_text-primary-foreground">
                  <span>
                    <UserPlus className="size-6" />
                  </span>
                  <span
                    className="hover_text-primary-foreground hover_font-semibold text-nowrap"
                    onClick={() =>
                      navigate("/signup", {
                        unstable_viewTransition: true,
                      })
                    }
                  >
                    Đăng Ký
                  </span>
                </SheetClose>
              </>
            )}
          </ScrollArea>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default UserSideBar;
