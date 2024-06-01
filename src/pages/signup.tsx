import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavLink } from "react-router-dom";

const signup = () => {
  return (
    <div className="w-full h-full flex justify-around">
      <Card className="mx-auto min-w-[30rem] my-auto shadow-slate-400 shadow-sm">
        <CardHeader className="mb-5">
          <CardTitle className="text-4xl mb-2">Đăng ký</CardTitle>
          <CardDescription>
            Nhập thông tin của bạn để tạo tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8">
            <div className="grid gap-2">
              <Label htmlFor="first-name" className="font-extrabold">
                Họ và tên
                <span className="text-red-600 ">*</span>
              </Label>
              <Input id="first-name" placeholder="Nguyễn Văn A" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-extrabold">
                Email
                <span className="text-red-600 ">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password" className="font-extrabold">
                  Mật khẩu
                  <span className="text-red-600 ">*</span>
                </Label>
                <Input id="password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="font-extrabold">
                  Nhập lại mật khẩu
                  <span className="text-red-600 ">*</span>
                </Label>
                <Input id="password" type="password" />
              </div>
            </div>
            <Button type="submit" variant="neutral" className="w-full">
              Tạo tài khoản
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Bạn đã có tài khoản? &nbsp;
            <NavLink to="/login" className="underline hover_text-primary">
              Đăng nhập
            </NavLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default signup;
