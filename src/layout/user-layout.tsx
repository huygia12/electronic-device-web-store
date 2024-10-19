import { BlinkProvider, CartProvider } from "@/context";
import React, { useEffect } from "react";
import { Outlet, useNavigation, useRouteLoaderData } from "react-router-dom";
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
        <div className="flex justify-center space-x-10 w-full py-10 min-h-[70vh]">
          <Banner
            bannerUrl={store.leftBanner}
            className="sticky top-36 self-start"
          />
          <div className="w-myLayout">
            {navigation.state === "loading" ? <TopBarProgress /> : <Outlet />}
          </div>
          <Banner
            bannerUrl={store.rightBanner}
            className="sticky top-36 self-start"
          />
        </div>
        <MailRegisterSection />
        <AppFooter />
        <ZaloButton />
        <ScrollToTopButton />
        <Toaster
          richColors
          toastOptions={{
            className: "text-xl h-[5rem] right-10 bottom-5 ",
          }}
          closeButton={true}
        />
      </BlinkProvider>
    </CartProvider>
  );
};

export default UserLayout;
