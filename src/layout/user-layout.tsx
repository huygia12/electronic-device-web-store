import { CartProvider } from "@/context";
import React from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { Toaster } from "sonner";
import {
  ScrollToTop,
  ScrollToTopButton,
  TopBarProgress,
} from "@/components/effect";
import { MailRegisterSection, UserHeader, AppFooter } from ".";
import { ZaloButton } from "@/components/user";

const UserLayout: React.FC = () => {
  const navigation = useNavigation();

  return (
    <CartProvider>
      <ScrollToTop />
      <UserHeader />
      <main className="flex justify-center w-full py-10 min-h-[70vh]">
        <div className="w-myLayout">
          {navigation.state === "loading" ? <TopBarProgress /> : <Outlet />}
        </div>
      </main>
      <MailRegisterSection />
      <AppFooter />
      <ZaloButton />
      <ScrollToTopButton />
      <Toaster richColors />
    </CartProvider>
  );
};

export default UserLayout;
