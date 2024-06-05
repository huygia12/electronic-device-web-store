import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface AppFooterProps extends HTMLAttributes<HTMLElement> {}

const AppFooter: React.FC<AppFooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        "w-full flex justify-evenly shadow-inner mt-auto",
        className
      )}
    >
      <div className="grid grid-cols-2 w-3/4 my-5 ">
        <div className="flex flex-col space-y-2 text-[0.8rem]">
          <span>© 2024 Công ty Cổ phần đầu tư công nghệ</span>
          <span>
            Địa chỉ: số 124 Minh Khai, Phường Minh Khai, Quận Hai Bà Trưng, Hà
            Nội
          </span>
          <span>GPĐKKD số ********** Sở KHĐT Tp.Hà Nội cấp ngày --/-/2---</span>
          <span>
            Email: info@hieunguyen.@gmail.com. Điện thoại: 0388 725 928{" "}
          </span>
        </div>
        <div></div>
      </div>
    </footer>
  );
};

export default AppFooter;
