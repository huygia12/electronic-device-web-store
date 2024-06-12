import { cn } from "@/lib/utils";
import {
  ArrowRight,
  PackageCheck,
  PackageOpen,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

interface Phase {
  id: string;
  title: string;
  icon: JSX.Element;
}

const phases: Phase[] = [
  {
    id: "1",
    title: "Giỏ Hàng",
    icon: <ShoppingBag />,
  },
  {
    id: "2",
    title: "Đặt Hàng",
    icon: <PackageOpen />,
  },
  {
    id: "3",
    title: "Hoàn Thành Đơn Hàng",
    icon: <PackageCheck />,
  },
];

const PhasesLayout = () => {
  const [phaseID] = useState<string>("1");

  return (
    <>
      <div className="flex space-x-8 justify-center mb-14">
        {phases.map((item, index) => {
          return (
            <span key={index} className="flex items-center space-x-8">
              <span
                className={cn(
                  "text-[1.1rem] font-semibold flex items-center gap-2",
                  item.id === phaseID &&
                    "text-primary-foreground font-extrabold text-center text-[1.4rem]"
                )}
              >
                {item.icon}
                {item.title}
              </span>
              {!(index === phases.length - 1) && <ArrowRight />}
            </span>
          );
        })}
      </div>

      <Outlet />
    </>
  );
};

export { PhasesLayout };
