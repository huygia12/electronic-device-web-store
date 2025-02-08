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
import axios, { AxiosError, HttpStatusCode } from "axios";
import { LoadingSpinner } from "@/components/effect";
import { LoginFormProps, LoginSchema } from "@/utils/schema";
import { FC, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks";
import { ForgotPasswordDialog } from "@/components/login";
import { z } from "zod";
import { userService } from "@/services";
import { toast } from "sonner";

const Login: FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormProps>({
    resolver: zodResolver(LoginSchema),
  });
  const { login } = useAuth();
  const [openForgotPasswordDialog, setOpenForgotPasswordDialog] =
    useState<boolean>(false);
  const timeout = useRef<NodeJS.Timeout>();

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
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleForgotPasswordClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const email = getValues(`email`);
    const emailSchema = z.string().email();
    const result = emailSchema.safeParse(email);

    if (!result.success) {
      setOpenForgotPasswordDialog(false);
      setError(`email`, { message: "Email không hợp lệ!" });
      return;
    }

    try {
      await userService.apis.generateOTP(email);
      timeout.current = setTimeout(
        () => {
          setOpenForgotPasswordDialog(false);
          toast.info("Mã OTP đã hết hạn!");
        },
        2 * 60 * 1000 // 2 minutes
      );

      setOpenForgotPasswordDialog(true);
      clearErrors();
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status == HttpStatusCode.NotFound) {
          setError(`email`, { message: "Email chưa đăng ký!" });
        } else {
          setError(`root`, { message: "Tải khoản hiện không thể gửi mã OTP!" });
        }
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  });

  return (
    <form
      onSubmit={handleSubmit(handleLoginFormSubmission)}
      className="w-full h-full flex justify-around"
    >
      <Card className="w-[80vw] sms_w-[30rem] max my-auto shadow-slate-400">
        <CardHeader>
          <CardTitle className="text-4xl mb-2 h-full">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập email đã đăng ký để đăng nhập vào tài khoản của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2 ">
            <Label htmlFor="email" className="font-extrabold text-lg">
              Email
              <span className="text-red-600 ">*</span>
            </Label>
            <Input
              id="email"
              {...register("email")}
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
              type="password"
              autoComplete="new-password"
              className="text-lg"
            />
            {errors.password && (
              <div className="text-red-600">{errors.password.message}</div>
            )}
            <ForgotPasswordDialog
              isOpen={openForgotPasswordDialog}
              email={getValues(`email`)}
              className="self-end"
              setIsOpen={setOpenForgotPasswordDialog}
            >
              <button
                className="text-lg underline hover_text-blue-500 focus-visible_outline-none"
                onClick={handleForgotPasswordClick}
              >
                Quên mật khẩu
              </button>
            </ForgotPasswordDialog>
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
            Bạn chưa có tài khoản? &nbsp;
            <NavLink
              to="/signup"
              className="underline text-nowrap hover_text-primary"
            >
              Đăng ký
            </NavLink>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Login;
