import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

const url = "https://www.facebook.com/huynguyengia1203";

interface AppFooterProps extends HTMLAttributes<HTMLElement> {}

const AppFooter: React.FC<AppFooterProps> = ({ className }) => {
  return (
    <footer
      id="footer"
      className={cn(
        "w-full flex justify-evenly shadow-inner mt-auto pt-10",
        className
      )}
    >
      <div className="w-3/4 my-5">
        <div className="grid grid-cols-2 gap-10 lg_grid-cols-3 2xl_grid-cols-5">
          <div className="flex flex-col space-y-4 col-span-2">
            <span className="font-extrabold text-lg">VỀ HGSHOP</span>
            <span>© 2024 Công ty Cổ phần đầu tư công nghệ</span>
            <span>
              Địa chỉ: số 124 Minh Khai, Phường Minh Khai, Quận Hai Bà Trưng, Hà
              Nội
            </span>
            <span>
              GPĐKKD số ********** Sở KHĐT Tp.Hà Nội cấp ngày 14/07/2024
            </span>
            <span>
              Email: huycucngoan333@gmail.com. Điện thoại: 0773 341 ***
            </span>
          </div>

          <div className="flex flex-col space-y-4">
            <span className="font-extrabold text-lg">CHÍNH SÁCH</span>
            <a
              href={url}
              target="_blank"
              className="cursor-pointer hover_underline"
            >
              <span>Chính sách bảo hành</span>
            </a>
            <a
              href={url}
              target="_blank"
              className="cursor-pointer hover_underline"
            >
              <span>Chính sách bảo mật</span>
            </a>
            <a
              href={url}
              target="_blank"
              className="cursor-pointer hover_underline"
            >
              <span>Chính sách giao hàng</span>
            </a>
            <a
              href={url}
              target="_blank"
              className="cursor-pointer hover_underline"
            >
              <span>Chính sách thanh toán</span>
            </a>
          </div>

          <div className="flex flex-col space-y-4">
            <span className="font-extrabold text-lg">TỔNG ĐÀI HỖ TRỢ</span>
            <span className="space-x-4 flex">
              <span className="space-y-2 flex flex-col">
                <span>Mua hàng:</span>
                <span>Bảo hành:</span>
                <span>Khiếu nại:</span>
              </span>
              <span className="space-y-2 flex flex-col">
                <span className="font-extrabold">1900 18**</span>
                <span className="font-extrabold">1900 18**</span>
                <span className="font-extrabold">1900 1***</span>
              </span>
            </span>
          </div>

          <div className="flex space-x-14 2xl_flex-col 2xl_space-y-8 col-span-2 2xl_col-span-1 2xl_space-x-0">
            <div className="flex flex-col">
              <span className="font-extrabold text-lg mb-2">
                ĐƠN VỊ VẬN CHUYỂN
              </span>
              <span>
                <img src="/ghn.webp" alt="ghn" className="w-14" />
              </span>
            </div>
            <span className="flex flex-col">
              <span className="font-extrabold text-lg mb-2">
                CÁCH THỨC THANH TOÁN
              </span>
              <span className="grid grid-cols-2 md_grid-cols-3 gap-2 2xl_grid-cols-4">
                <img
                  src="/master-card.webp"
                  alt="master-card"
                  className="w-14"
                />
                <img src="/zalopay.webp" alt="zalopay" className="w-14" />
                <img src="/visa.webp" alt="visa" className="w-14" />
                <img src="/cod.webp" alt="cod" className="w-14" />
              </span>
            </span>
          </div>
        </div>

        <div className="border-t-slate-300 border-t-2 mt-10 pt-5 flex justify-between items-center">
          <span className="flex items-center space-x-2">
            <span className="font-semibold text-base">
              LIÊN HỆ VỚI CHÚNG TÔI
            </span>
            <a href={url} target="_blank">
              <img src="/facebook.webp" alt="fb" className="w-10" />
            </a>
            <a href={url} target="_blank">
              <img src="/titok.webp" alt="tiktok" className="w-10" />
            </a>
          </span>

          <img src="/logo-bct.webp" className="h-16" />
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
