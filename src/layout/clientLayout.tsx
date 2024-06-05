import MailRegisSection from "@/components/container/clientMailRegisSection";
import AppFooter from "../components/container/appFooter";
import AppClientHeader from "../components/container/clientHeader";
import React from "react";
import { Outlet } from "react-router-dom";

const ClientLayout: React.FC = () => {
  return (
    <>
      <AppClientHeader />
      <main className="flex justify-center w-full py-10 min-h-[70vh]">
        <div className="w-myLayout">
          <Outlet />
        </div>
      </main>
      <MailRegisSection />
      <AppFooter />
    </>
  );
};

export { ClientLayout };
