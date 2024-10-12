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
import { SubmitHandler, useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { HttpStatusCode } from "axios";
import { LoadingSpinner } from "@/components/effect";
import { LoginFormProps, LoginSchema } from "@/utils/schema";
import { FC } from "react";
import { useAuth } from "@/hooks";

const Login: FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormProps>({
    resolver: zodResolver(LoginSchema),
  });
  const { login } = useAuth();

  const handleLoginFormSubmission: SubmitHandler<LoginFormProps> = async (
    data
  ) => {
    try {
      await login(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          setError("root", {
            message: "Bạn chưa logout tài khoản hiện tại!",
          });
        } else if (error.response?.status == HttpStatusCode.NotFound) {
          setError("root", {
            message: "Tài khoản không tồn tại!",
          });
        } else if (error.response?.status == HttpStatusCode.Unauthorized) {
          setError("password", {
            message: "Mật khẩu chưa chính xác!",
          });
        } else {
          setError("root", {
            message: "Tài khoản hiện không thể đăng nhập!",
          });
        }
        // Handle error response if available
        console.error(`Response data: ${error.response?.data}`);
        console.error(`Response status: ${error.response?.status})`);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleLoginFormSubmission)}
      className="w-full h-full flex justify-around"
    >
      <Card className="min-w-[30rem] max my-auto shadow-slate-400">
        <CardHeader className="mb-5">
          <CardTitle className="text-4xl mb-2 h-full">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập email đã đăng ký để đăng nhập vào tài khoản của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8">
          <div className="grid gap-2 ">
            <Label htmlFor="email" className="font-extrabold text-lg">
              Email
              <span className="text-red-600 ">*</span>
            </Label>
            <Input
              id="email"
              {...register("email")}
              defaultValue="huy@gmail.com"
              type="email"
              placeholder="abc@gmail.com"
              autoComplete="email"
              className="text-lg"
            />
            {errors.email && (
              <div className="text-red-600">{errors.email.message}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="font-extrabold text-lg">
              Mật khẩu
              <span className="text-red-600 ">*</span>
            </Label>
            <Input
              id="password"
              {...register("password")}
              defaultValue="123123"
              type="password"
              autoComplete="new-password"
              className="text-lg"
            />
            {errors.password && (
              <div className="text-red-600">{errors.password.message}</div>
            )}
            <NavLink
              to="/login"
              className="text-lg underline hover_text-blue-500 self-end"
            >
              Quên mật khẩu
            </NavLink>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col justify-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="neutral"
            className="w-full text-lg"
          >
            {!isSubmitting ? (
              "Đăng nhập"
            ) : (
              <LoadingSpinner size={26} className="text-white" />
            )}
          </Button>
          {errors.root && (
            <div className="text-red-600 mt-4">{errors.root.message}</div>
          )}
          <div className="mt-4 text-center text-lg">
            Bạn đã có tài khoản? &nbsp;
            <NavLink to="/signup" className="underline hover_text-primary">
              Đăng ký
            </NavLink>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Login;
