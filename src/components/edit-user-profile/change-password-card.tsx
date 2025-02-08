import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FC, HTMLAttributes, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import ConfirmNewPasswordDialog from "./confirm-new-password-dialog";
import { toast } from "sonner";
import { userService } from "@/services";
import { useCurrentUser } from "@/hooks";
import { HttpStatusCode } from "axios";

const ChangePasswordCard: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const { currentUser } = useCurrentUser();

  const handleUpdatePassword = async (value: string) => {
    if (!oldPassword) {
      toast.error("Vui lòng nhập mật khẩu cũ!");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("Mật khẩu mới không hợp lệ!");
      return;
    }
    if (value !== newPassword) {
      toast.error("Mật khẩu nhập lại chưa chính xác!");
      return;
    }

    const updatePassword = userService.apis.updatePassword(
      currentUser!.userID,
      oldPassword,
      newPassword
    );

    toast.promise(updatePassword, {
      loading: "Đang xử lý...",
      success: () => {
        setNewPassword(undefined);
        setOldPassword(undefined);
        return "Thay đổi thành công!";
      },
      error: (error) => {
        if (error.response?.status == HttpStatusCode.Unauthorized) {
          return "Thay đổi thất bại: mật khẩu cũ không đúng!";
        }
        return "Thay đổi thất bại!";
      },
    });
  };

  return (
    <Card className="w-[90vw] xl_w-full pb-4">
      <CardHeader>
        <CardTitle>Thay đổi mật khẩu</CardTitle>
        <CardDescription>
          Mật khẩu mạnh nên bao gồm kí tự đặc biệt.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex gap-4 flex-col lg_flex-row">
          <div className="flex relative">
            <Label htmlFor="old-password" className="text-lg my-auto w-[14rem]">
              Mật khẩu cũ
              <span className="text-red-600 ">*</span>
            </Label>
            <Input
              id="old-password"
              type={!oldPasswordVisible ? "password" : "text"}
              autoComplete="new-password"
              className="h-full text-lg pr-10"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <button
              className="absolute text-muted-foreground right-2 top-1/2 transform -translate-y-5 xss_-translate-y-1/2"
              onClick={(e) => {
                e.preventDefault();
                setOldPasswordVisible(!oldPasswordVisible);
              }}
            >
              {oldPasswordVisible ? (
                <EyeOff className="ml-2" />
              ) : (
                <Eye className="ml-2" />
              )}
            </button>
          </div>
          <div className="flex relative lg_ml-auto">
            <Label htmlFor="new-password" className="text-lg my-auto w-[14rem]">
              Mật khẩu mới
              <span className="text-red-600 ">*</span>
            </Label>
            <Input
              id="new-password"
              type={!newPasswordVisible ? "password" : "text"}
              autoComplete="new-password"
              className="h-full text-lg pr-10"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              className="absolute text-muted-foreground right-2 top-1/2 transform -translate-y-5 xss_-translate-y-1/2"
              onClick={(e) => {
                e.preventDefault();
                setNewPasswordVisible(!newPasswordVisible);
              }}
            >
              {newPasswordVisible ? (
                <EyeOff className="ml-2" />
              ) : (
                <Eye className="ml-2" />
              )}
            </button>
          </div>
          <ConfirmNewPasswordDialog
            handleDialogAcceptEvent={handleUpdatePassword}
          >
            <Button variant="negative" className="ml-auto">
              Lưu
            </Button>
          </ConfirmNewPasswordDialog>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordCard;
