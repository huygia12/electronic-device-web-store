import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BsSendExclamation } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import notificationService from "@/services/notification";
import { useState } from "react";

const ClientSection = () => {
  const [guestEmail, setGuestEmail] = useState<string>(``);

  const signupForNotifications = async () => {
    if (guestEmail.trim().length === 0) {
      toast.warning("Vui lòng nhập email!");
      return;
    }

    try {
      await notificationService.apis.signupForNotification(guestEmail);
      toast.success("Đăng ký nhận thông báo email thành công!");
    } catch {
      toast.success("Đăng ký nhận thông báo email thất bại!");
    }
  };

  return (
    <section className="text-sm md_text-base bg-theme-softer flex flex-col items-center py-6 font-extrabold text-primary-foreground space-y-2">
      <div className="flex items-center px-4">
        <BsSendExclamation className="mr-2 text-primary-foreground size-14 sms_size-10 md_size-6" />
        ĐĂNG KÝ NHẬN EMAIL THÔNG BÁO KHUYẾN MẠI HOẶC ĐỂ ĐƯỢC TƯ VẤN MIỄN PHÍ
      </div>
      <div className="flex">
        <Input
          type="email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          placeholder="Nhập email của bạn"
          className="w-[70vw] sms_w-[30rem] rounded-r-none text-gray-500 text-lg placeholder_text-sm focus_mr-1"
        />
        <Button
          variant="negative"
          onClick={signupForNotifications}
          className="rounded-l-none"
        >
          Gửi
        </Button>
      </div>
    </section>
  );
};

export default ClientSection;
