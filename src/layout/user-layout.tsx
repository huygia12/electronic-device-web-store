import { BlinkProvider, CartProvider } from "@/context";
import React, { useEffect, useState } from "react";
import {
  Outlet,
  useNavigation,
  useRouteLoaderData,
  useSearchParams,
} from "react-router-dom";
import { Toaster, toast } from "sonner";
import {
  ScrollToTop,
  ScrollToTopButton,
  TopBarProgress,
} from "@/components/effect";
import { MailRegisterSection, UserHeader, AppFooter } from ".";
import { ZaloButton } from "@/components/user";
import { Banner } from "@/components/common";
import { Store } from "@/types/model";
import { useAuth, useCurrentUser, useSocket } from "@/hooks";
import { authService, invoiceService } from "@/services";
import useMyInvoice from "@/hooks/use-invoice";
import { InvoiceStatus } from "@/types/enum";

const UserLayout: React.FC = () => {
  const store = useRouteLoaderData("userlayout") as Store;
  const navigation = useNavigation();
  const { socket } = useSocket();
  const { logout } = useAuth();
  const { setNumberOfShippingInvoice: setNumberOfRequestingInvoice } =
    useMyInvoice();
  const { currentUser } = useCurrentUser();
  const [searchParams] = useSearchParams();
  const [paidSuccess, setPaidSuccess] = useState<boolean>(false);

  useEffect(() => {
    const checkRoutingParams = async () => {
      const paidInvoiceID: string | null = searchParams.get("paidInvoiceID");
      if (paidInvoiceID) {
        setPaidSuccess(true);
      }
    };

    checkRoutingParams();
  }, [searchParams]);

  useEffect(() => {
    const checkPaid = async () => {
      if (paidSuccess) {
        toast.success("Thanh toán đơn hàng thành công!");
        setPaidSuccess(false);
      }
    };

    checkPaid();
  }, [paidSuccess]);

  useEffect(() => {
    const handleBanned = async (payload: { userID: string }) => {
      if (authService.getUser()?.userID === payload.userID) {
        toast.info("Tài khoản của bạn đã bị khóa!");
        await logout();
      }
    };

    socket?.on("user:ban", handleBanned);

    return () => {
      socket?.off("user:ban", handleBanned);
    };
  }, []);

  useEffect(() => {
    const initialize = async () => {
      const res = await invoiceService.apis.getInvoices({
        userID: currentUser!.userID,
        status: InvoiceStatus.SHIPPING,
      });
      setNumberOfRequestingInvoice(res.totalInvoices);
    };

    currentUser && initialize();
  }, []);

  return (
    <CartProvider>
      <BlinkProvider>
        <ScrollToTop />
        <UserHeader />
        <div className="flex justify-center w-full py-10 min-h-[70vh] gap-6 4xl_gap-10">
          <Banner
            bannerUrl={store.leftBanner}
            className="sticky top-36 self-start hidden xl_block xl_w-36 xl_min-w-32 2xl_w-48 2xl_min-w-36"
          />
          <div className="!ml-0 w-lg 2xl_w-xl 4xl_w-2xl">
            {navigation.state === "loading" ? <TopBarProgress /> : <Outlet />}
          </div>
          <Banner
            bannerUrl={store.rightBanner}
            className="!ml-0 sticky top-36 self-start hidden xl_block xl_w-36 xl_min-w-32 2xl_w-48 2xl_min-w-36"
          />
        </div>
        <MailRegisterSection />
        <AppFooter />
        <ZaloButton className="bottom-28 right-5" />
        <ScrollToTopButton className="bottom-5 right-4" />
        <Toaster
          richColors
          toastOptions={{
            className: "text-xl h-[5rem] right-10 bottom-5 ",
          }}
        />
      </BlinkProvider>
    </CartProvider>
  );
};

export default UserLayout;
