import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavLink } from "react-router-dom";

const Login = () => {
  return (
    <div className="w-full h-full flex justify-around">
      <Card className="min-w-[30rem] max my-auto shadow-slate-400">
        <CardHeader className="mb-5">
          <CardTitle className="text-4xl mb-2 h-full">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập email đã đăng ký để đăng nhập vào tài khoản của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8">
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-extrabold">
              Email
              <span className="text-red-600 ">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="abc@gmail.com"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="font-extrabold">
              Mật khẩu
              <span className="text-red-600 ">*</span>
            </Label>
            <Input id="password" type="password" required />
            <NavLink
              to="/login"
              className="text-sm underline hover_text-blue-500 self-end"
            >
              Quên mật khẩu
            </NavLink>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button variant="neutral" className="w-full">
            Đăng nhập
          </Button>
          <div className="mt-4 text-center text-sm">
            Bạn đã có tài khoản? &nbsp;
            <NavLink to="/signup" className="underline hover_text-primary">
              Đăng ký
            </NavLink>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
