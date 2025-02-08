import { LiaShippingFastSolid } from "react-icons/lia";
import { FiShoppingBag } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { AlignJustify, PackageSearch } from "lucide-react";
import { useBlink, useCartProps, useCustomNavigate, useSocket } from "@/hooks";
import {
  CounterLabel,
  SearchBar,
  SearchBarPopUp,
  UserDropDownMenu,
  UserSideBar,
} from "@/components/user";
import { InvoiceStatus } from "@/types/enum";
import { NotificationItem, NotificationSection } from "@/components/common";
import { FC, useEffect, useState } from "react";
import useCurrentUser from "@/hooks/use-current-user";
import { invoiceService } from "@/services";

const navComponents: { title: string; path: string }[] = [
  { title: "Trang Chủ", path: "/" },
  { title: "Giới Thiệu", path: "#footer" },
  { title: "Liên Hệ", path: "#footer" },
];

const AppClientHeader: FC = () => {
  const { itemsInLocal } = useCartProps();
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
  }, [currentUser]);

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
        <div className="flex flex-row justify-between gap-2 text-[0.8rem] px-4 py-2 w-lg 2xl_w-xl 3xl_w-2xl">
          <span className="flex items-center ">
            <TfiHeadphoneAlt className="pr-2" size={20} />
            Gọi mua hàng: &nbsp;
            <b> Hà Nội: 0773.341.*** (8h-21h)</b>
          </span>
          <span className="self-end hidden sm_block">
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
        <div className="flex items-center p-4 lg-p-0 w-lg 2xl_w-xl 3xl_w-2xl">
          {/** WEBSITE LOGO */}
          <NavLink to="/" unstable_viewTransition>
            <img src="/logo.png" alt="logo" className="h-10 xs_h-12 lg_h-14" />
          </NavLink>

          {/** SEARCH BAR AND OTHERS */}
          <div className="px-4 flex-1 flex gap-4 2xl_grid 2xl_grid-cols-6 2xl_gap-0">
            <button
              onClick={handleGoToMenu}
              className="hidden lg_flex w-36 bg-theme-softer text-gray-700 rounded-md px-2 h-10 items-center hover_bg-yellow-400 text-nowrap"
            >
              <AlignJustify className="mr-2" /> Danh Mục
            </button>

            <SearchBar className="hidden sms_block 2xl_ml-10 2xl_col-span-3" />
            <SearchBarPopUp className="block sms_hidden ml-auto" />

            <div className="items-center space-x-[1.5rem] flex flex-row ml-4 2xl_col-span-2 2xl_ml-20">
              <NavLink
                to="/cart/view"
                className="relative"
                unstable_viewTransition
              >
                <FiShoppingBag size={34} />
                <CounterLabel counter={itemsInLocal.length} />
              </NavLink>

              {currentUser ? (
                <>
                  <NavLink
                    to={`/users/${currentUser.userID}/orders?status=${InvoiceStatus.SHIPPING}`}
                    className="relative hidden xs_block"
                    unstable_viewTransition
                  >
                    <LiaShippingFastSolid size={42} />
                    <CounterLabel counter={numberOfShippingInvoice} />
                  </NavLink>

                  <NotificationSection
                    triangleCSS="right-[2.35rem]"
                    className="-right-[2rem]"
                  >
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
                  className="relative hidden sms_block"
                  unstable_viewTransition
                >
                  <PackageSearch size={38} />
                </NavLink>
              )}
            </div>
          </div>

          {/** USER DROP DOWN MENU */}
          <UserDropDownMenu className="hidden ml-auto md_flex" />
          <UserSideBar className="ml-auto block md_hidden" />
        </div>
      </div>
    </header>
  );
};

export default AppClientHeader;
