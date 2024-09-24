import { CartProvider } from "@/context";
import React from "react";
import { Outlet, useNavigation, useRouteLoaderData } from "react-router-dom";
import { Toaster } from "sonner";
import {
  ScrollToTop,
  ScrollToTopButton,
  TopBarProgress,
} from "@/components/effect";
import { MailRegisterSection, UserHeader, AppFooter } from ".";
import { ZaloButton } from "@/components/user";
import { Banner } from "@/components/common";
import { StoreFullJoin } from "@/types/model";

const UserLayout: React.FC = () => {
  const store = useRouteLoaderData("userlayout") as StoreFullJoin;
  const navigation = useNavigation();

  return (
    <CartProvider>
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
      <Toaster richColors />
    </CartProvider>
  );
};

export default UserLayout;
