import MailRegisSection from "@/components/container/ClientMailRegisSection";
import AppClientFooter from "../components/container/ClientFooter";
import AppClientHeader from "../components/container/ClientHeader";
import React from "react";

const ProductsLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <AppClientHeader />
      <div className="flex justify-center w-full py-10 min-h-[100vh]">
        <div className="w-myLayout ">{children}</div>
      </div>
      <MailRegisSection />
      <AppClientFooter />
    </>
  );
};

export default ProductsLayout;
