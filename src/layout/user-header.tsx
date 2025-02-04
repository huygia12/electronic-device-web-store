import { LiaShippingFastSolid } from "react-icons/lia";
import { FiShoppingBag } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { AlignJustify, PackageSearch } from "lucide-react";
import {
  useAuth,
  useBlink,
  useCartProps,
  useCustomNavigate,
  useSocket,
} from "@/hooks";
import { toast } from "sonner";
import { CounterLabel } from "@/components/user";
import { InvoiceStatus, Role } from "@/types/enum";
import {
  DropMenuLinkItem,
  DropdownAvatar,
  NotificationItem,
  NotificationSection,
} from "@/components/common";
import { FC, useEffect, useState } from "react";
import useCurrentUser from "@/hooks/use-current-user";
import SearchBar from "@/components/user/search-bar";
import { invoiceService } from "@/services";

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
  const [numberOfShippingInvoice, setNumberOfShippingInvoice] =
    useState<number>(0);
  const [numberOfAbortedOrders, setNumberOfAbortedOrders] = useState<
    number | null
  >(null);
  const [numberOfDoneOrders, setNumberOfDoneOrders] = useState<number | null>(
    null
  );
  const [numberOfPaymentWaitingOrders, setNumberOfPaymentWaittingOrders] =
    useState<number | null>(null);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();

      let response = await invoiceService.apis.countInvoices({
        status: InvoiceStatus.SHIPPING,
        userID: currentUser!.userID,
      });
      setNumberOfShippingInvoice(response);

      response = await invoiceService.apis.countInvoices({
        status: InvoiceStatus.PAYMENT_WAITING,
        userID: currentUser!.userID,
      });
      setNumberOfPaymentWaittingOrders(response ? response : null);

      response = await invoiceService.apis.countInvoices({
        status: InvoiceStatus.DONE,
        userID: currentUser!.userID,
        date: today,
      });
      setNumberOfDoneOrders(response ? response : null);

      response = await invoiceService.apis.countInvoices({
        status: InvoiceStatus.ABORT,
        userID: currentUser!.userID,
        date: today,
      });
      setNumberOfAbortedOrders(response ? response : null);
    };

    currentUser && fetchData();
  }, []);

  useEffect(() => {
    const updateNumberOfOrders = async (payload: {
      numberOfNewInvoices: number;
      newStatus: InvoiceStatus;
    }) => {
      switch (payload.newStatus) {
        case InvoiceStatus.SHIPPING:
          setNumberOfShippingInvoice(payload.numberOfNewInvoices);
          break;
        case InvoiceStatus.DONE:
          setNumberOfDoneOrders(payload.numberOfNewInvoices);
          break;
        case InvoiceStatus.ABORT:
          setNumberOfAbortedOrders(payload.numberOfNewInvoices);
          break;
        case InvoiceStatus.PAYMENT_WAITING:
          setNumberOfPaymentWaittingOrders(payload.numberOfNewInvoices);
          break;
        default:
          break;
      }
    };

    socket?.on("invoice:update-status", updateNumberOfOrders);

    return () => {
      socket?.off("invoice:update-status", updateNumberOfOrders);
    };
  }, []);

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
        <div className="flex justify-between text-[0.8rem] py-2 w-lg 2xl_w-xl 3xl_w-2xl">
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
      <div className="bg-theme h-[5rem] w-full shadow-md flex justify-center ">
        <div className="items-center grid grid-cols-10 w-lg 2xl_w-xl 3xl_w-2xl">
          {/** WEBSITE LOGO */}
          <NavLink to="/" className="col-span-2" unstable_viewTransition>
            <img src="/logo.png" alt="logo" className="h-14" />
          </NavLink>

          {/** SEARCH BAR AND OTHERS */}
          <div className="pr-10 gap-14 col-span-6 flex 2xl_grid 2xl_grid-cols-6 2xl_gap-0 3xl_pr-0 items-center">
            <button
              onClick={handleGoToMenu}
              className="hidden 2xl_flex w-36 bg-theme-softer text-gray-700 rounded-md px-2 h-10 items-center hover_bg-yellow-400 text-nowrap"
            >
              <AlignJustify className="mr-2" /> Danh Mục
            </button>

            <SearchBar className="w-full 2xl_ml-10 2xl_col-span-3" />

            <div className="2xl_col-span-2 2xl_ml-20 flex flex-row items-center space-x-[1.5rem]">
              <NavLink
                to="/cart/view"
                className="relative"
                unstable_viewTransition
              >
                <FiShoppingBag size={36} />
                <CounterLabel counter={itemsInLocal.length} />
              </NavLink>

              {currentUser ? (
                <>
                  <NavLink
                    to={`/users/${currentUser.userID}/orders?status=${InvoiceStatus.SHIPPING}`}
                    className="relative"
                    unstable_viewTransition
                  >
                    <LiaShippingFastSolid size={42} />
                    <CounterLabel counter={numberOfShippingInvoice} />
                  </NavLink>

                  <NotificationSection>
                    {numberOfPaymentWaitingOrders ? (
                      <NotificationItem
                        imageUrl="/pay-order.avif"
                        title="ĐƠN HÀNG CẦN THANH TOÁN"
                        description={`Bạn có ${numberOfPaymentWaitingOrders} đơn hàng đang cần thanh toán, xem ngay.`}
                        to={`users/${currentUser.userID}/orders?status=${InvoiceStatus.PAYMENT_WAITING}`}
                      />
                    ) : undefined}
                    {numberOfDoneOrders ? (
                      <NotificationItem
                        imageUrl="/accept-order.jpg"
                        title="ĐƠN HÀNG GIAO THÀNH CÔNG"
                        description={`Bạn có ${numberOfDoneOrders} đơn hàng đã giao thành công trong hôm nay, xem ngay.`}
                        to={`users/${currentUser.userID}/orders?status=${InvoiceStatus.DONE}`}
                      />
                    ) : undefined}
                    {numberOfAbortedOrders ? (
                      <NotificationItem
                        imageUrl="/deny-order.jpg"
                        title="ĐƠN HÀNG BỊ HỦY"
                        description={`Bạn có ${numberOfAbortedOrders} đơn hàng đã bị hủy trong hôm nay, xem ngay.`}
                        to={`users/${currentUser.userID}/orders?status=${InvoiceStatus.ABORT}`}
                      />
                    ) : undefined}
                  </NotificationSection>
                </>
              ) : (
                <NavLink
                  to="/lookup"
                  className="relative"
                  unstable_viewTransition
                >
                  <PackageSearch size={38} />
                </NavLink>
              )}
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
          ) : (
            <div className="space-x-2 text-[1.1rem] flex justify-end ml-auto">
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
          )}
        </div>
      </div>
    </header>
  );
};

export default AppClientHeader;
