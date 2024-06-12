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
import { NavLink, Navigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useState } from "react";
import axios from "axios";

const LoginSchema = z.object({
  email: z.string().email({ message: "Email không đúng định dạng!" }),
  password: z.string().min(6, { message: "Mật khẩu chứa tối thiểu 6 kí tự!" }),
});

type LoginForm = z.infer<typeof LoginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const [success, setSucess] = useState(false);

  const handleLoginFormSubmission: SubmitHandler<LoginForm> = async (data) => {
    try {
      const res = await axios.post("http://localhost:8000/auth/login", {
        email: data.email,
        password: data.password,
      });

      console.log(isSubmitSuccessful, res);
      console.log(isSubmitSuccessful);
      setSucess(true);
      // throw new Error();
    } catch (error) {
      setError("root", {
        message: "Tài khoản hiện không thể đăng nhập!",
      });
    }
  };

  if (success) {
    return <Navigate to={"/"} replace={true} />;
  }

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
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-extrabold">
              Email
              <span className="text-red-600 ">*</span>
            </Label>
            <Input
              id="email"
              {...register("email")}
              type="email"
              placeholder="abc@gmail.com"
              autoComplete="email"
            />
            {errors.email && (
              <div className="text-red-600">{errors.email.message}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="font-extrabold">
              Mật khẩu
              <span className="text-red-600 ">*</span>
            </Label>
            <Input
              id="password"
              {...register("password")}
              type="password"
              autoComplete="new-password"
            />
            {errors.password && (
              <div className="text-red-600">{errors.password.message}</div>
            )}
            <NavLink
              to="/login"
              className="text-sm underline hover_text-blue-500 self-end"
            >
              Quên mật khẩu
            </NavLink>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="neutral"
            className="w-full"
          >
            {!isSubmitting ? (
              "Đăng nhập"
            ) : (
              <LoadingSpinner size={26} className="text-white" />
            )}
          </Button>
          {errors.root && (
            <div className="text-red-600">{errors.root.message}</div>
          )}
          <div className="mt-4 text-center text-sm">
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
