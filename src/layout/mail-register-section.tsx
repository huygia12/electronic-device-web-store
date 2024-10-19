import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BsSendExclamation } from "react-icons/bs";
import { Button } from "@/components/ui/button";

const ClientSection = () => {
  return (
    <section className="bg-theme-softer flex flex-col items-center py-6 font-extrabold text-primary-foreground space-y-2">
      <div className="flex items-center">
        <BsSendExclamation className="mr-2 text-primary-foreground" size={22} />
        ĐĂNG KÝ NHẬN EMAIL THÔNG BÁO KHUYẾN MẠI HOẶC ĐỂ ĐƯỢC TƯ VẤN MIỄN PHÍ
      </div>
      <div className="flex">
        <Input
          type="email"
          placeholder="Nhập email của bạn"
          className="w-[30rem] rounded-r-none focus_mr-1"
        />
        <Button
          variant="negative"
          onClick={() =>
            toast.success("Đăng ký nhận thông báo email thành công!")
          }
          className="rounded-l-none"
        >
          Gửi
        </Button>
      </div>
    </section>
  );
};

export default ClientSection;
