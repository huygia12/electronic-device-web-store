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
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

const ChangePasswordCard: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  return (
    <Card className="w-full pb-4">
      <CardHeader>
        <CardTitle>Thay đổi mật khẩu</CardTitle>
        <CardDescription>
          Mật khẩu mạnh nên bao gồm kí tự đặc biệt.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex">
          <input hidden type="text" autoComplete="username" />
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
            />
            <button
              className="absolute text-muted-foreground right-2 bottom-2"
              onClick={(e) => {
                e.preventDefault();
                setOldPasswordVisible(!oldPasswordVisible);
              }}
            >
              {oldPasswordVisible ? (
                <Eye className="ml-2" />
              ) : (
                <EyeOff className="ml-2" />
              )}
            </button>
          </div>
          <div className="flex ml-auto relative">
            <Label htmlFor="new-password" className="text-lg my-auto w-[14rem]">
              Mật khẩu mới
              <span className="text-red-600 ">*</span>
            </Label>
            <Input
              id="new-password"
              type={!newPasswordVisible ? "password" : "text"}
              autoComplete="new-password"
              className="h-full text-lg pr-10"
            />
            <button
              className="absolute text-muted-foreground right-2 bottom-2"
              onClick={(e) => {
                e.preventDefault();
                setNewPasswordVisible(!newPasswordVisible);
              }}
            >
              {newPasswordVisible ? (
                <Eye className="ml-2" />
              ) : (
                <EyeOff className="ml-2" />
              )}
            </button>
          </div>
          <Button variant="negative" className="ml-auto">
            Lưu
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordCard;
