import { CartProvider } from "@/context";
import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { ScrollToTop } from "@/components/effect";
import { MailRegisterSection, UserHeader, AppFooter } from ".";

const UserLayout: React.FC = () => {
  return (
    <CartProvider>
      <ScrollToTop />
      <UserHeader />
      <main className="flex justify-center w-full py-10 min-h-[70vh]">
        <div className="w-myLayout">
          <Outlet />
        </div>
      </main>
      <MailRegisterSection />
      <AppFooter />
      <Toaster richColors />
    </CartProvider>
  );
};

export default UserLayout;
