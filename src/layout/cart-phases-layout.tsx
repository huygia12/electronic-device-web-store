import { cn } from "@/lib/utils";
import { useCartProps } from "@/hooks";
import { ArrowRight } from "lucide-react";
import { Outlet } from "react-router-dom";
import { phases } from "@/utils/constants";

const PhasesLayout = () => {
  const { phaseID } = useCartProps();

  return (
    <>
      <div className="flex gap-4 justify-center mb-10">
        {phases.map((item, index) => {
          return (
            <span key={index} className="flex items-center gap-2 xss_gap-4">
              <span
                className={cn(
                  "text-[0.9rem] md_text-[1.1rem] font-semibold flex flex-col xs_flex-row justify-center items-center gap-1 md_gap-2",
                  item.id === phaseID &&
                    "text-primary-foreground font-extrabold text-center text-base md_text-[1.3rem]"
                )}
              >
                <item.icon
                  className={cn("size-6", item.id === phaseID && "size-8")}
                />
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

export default PhasesLayout;
