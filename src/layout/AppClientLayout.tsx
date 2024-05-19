import AppClientHeader from "./AppClientHeader";
import AppNav from "./AppClientNav";
import React from "react";

const AppClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <AppClientHeader />
      <AppNav />
      <div className="Container">{children}</div>
    </>
  );
};

export default AppClientLayout;
