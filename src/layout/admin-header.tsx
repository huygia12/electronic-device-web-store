import { TbCategoryPlus } from "react-icons/tb";
import { Package2 } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminAccordion, AdminHeaderIntroGuide } from "@/components/admin";
import { navItems } from "@/utils/constants";
import { useAuth, useCurrentUser, useSocket } from "@/hooks";
import {
  DropMenuLinkItem,
  DropdownAvatar,
  NotificationItem,
  NotificationSection,
} from "@/components/common";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InvoiceStatus } from "@/types/enum";
import { invoiceService } from "@/services";

const AdminHeader: FC = () => {
  const { logout } = useAuth();
  const { currentUser } = useCurrentUser();
  const [numberOfNewOrders, setNumberOfNewOrders] = useState<number | null>(
    null
  );
  const { socket } = useSocket();

  useEffect(() => {
    const fetchData = async () => {
      const response = await invoiceService.apis.countInvoices({
        status: InvoiceStatus.NEW,
      });
      setNumberOfNewOrders(response ? response : null);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateNumberOfNewOrders = async (payload: {
      numberOfNewInvoices: number;
    }) => {
      setNumberOfNewOrders(payload.numberOfNewInvoices);
    };

    socket?.on("invoice:new", updateNumberOfNewOrders);

    return () => {
      socket?.off("invoice:new", updateNumberOfNewOrders);
    };
  }, []);

  return (
    <div className="w-full py-3 flex flex-col sticky top-0 z-50 bg-theme shadow-xl items-center">
      <div className="w-[90vw] lg_w-lg xl_w-xl 2xl_w-2xl 4xl_w-3xl flex items-center justify-between">
        {/** NAV BAR */}
        <Sheet>
          <SheetTrigger asChild>
            <Button id="header-guide-step-1" variant="ghost" size="icon">
              <TbCategoryPlus size={55} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="max-w-xs">
            <nav className="grid gap-8 text-lg font-medium">
              <div className="group flex h-16 w-16 items-center justify-center rounded-full bg-theme">
                <Package2 className="h-10 w-10 transition-all group-hover_scale-110" />
              </div>
              <ScrollArea className="h-[100vh]">
                {navItems.map((item, index) =>
                  item.hasChild ? (
                    <AdminAccordion key={index} subItems={item.children}>
                      <div className="flex text-[0.9rem] md_text-[1.1rem] items-center gap-2 px-2.5 text-muted-foreground hover_text-primary-foreground">
                        <span>
                          <item.icon className="size-6" />
                        </span>
                        <span className="text-nowrap">{item.name}</span>
                      </div>
                    </AdminAccordion>
                  ) : (
                    <div key={index}>
                      <NavLink
                        to={item.url}
                        className="flex text-[0.9rem] md_text-[1.1rem] border-b py-4 px-2.5"
                      >
                        <SheetClose className="flex items-center gap-2 text-muted-foreground hover_text-primary-foreground">
                          <span>
                            <item.icon className="size-6" />
                          </span>
                          <span className="text-nowrap">{item.name}</span>
                        </SheetClose>
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
          <NotificationSection
            triangleCSS="right-[12.35rem] xss_right-[11.35rem] md_right-1/2 md_transform md_translate-x-1/2"
            className="-right-48 xss_-right-44 md_right-1/2 md_transform md_translate-x-1/2"
          >
            {numberOfNewOrders ? (
              <NotificationItem
                imageUrl="/new-product.png"
                title="ĐƠN HÀNG MỚI"
                description={`Bạn có ${numberOfNewOrders} đơn hàng đang chờ được duyệt, xem ngay.`}
                to={`/admin/invoices?status=${InvoiceStatus.NEW}`}
              />
            ) : undefined}
          </NotificationSection>

          <DropdownAvatar className="ml-4 mlg_ml-10">
            <DropMenuLinkItem
              item={{
                name: "Tài Khoản Của Tôi",
                src: `/users/${currentUser?.userID}`,
                visible: true,
              }}
            />
            <DropMenuLinkItem
              item={{
                name: "Trang chủ",
                src: `/`,
                visible: true,
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
        </div>

        <AdminHeaderIntroGuide />
      </div>
    </div>
  );
};

export default AdminHeader;
