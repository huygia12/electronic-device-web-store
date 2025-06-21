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
import { SubmitHandler, useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { FC, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import { LoadingSpinner } from "@/components/effect";
import { SignupFormProps, SignupSchema } from "@/utils/schema";
import { userService } from "@/services";
import { useCustomNavigate } from "@/hooks";

const Signup: FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormProps>({
    resolver: zodResolver(SignupSchema),
  });
  const [passwordVisibility, setPasswordvisibility] = useState(false);
  const [retypePasswordVisibility, setRetypePasswordvisibility] =
    useState(false);
  const { navigate } = useCustomNavigate();

  const handleSignupFormSubmission: SubmitHandler<SignupFormProps> = async (
    data
  ) => {
    try {
      if (data.retypePassword != data.password) {
        setError("password", {
          message: "Mật khẩu nhập lại không khớp!",
        });
        return;
      }

      await userService.apis.signup(data);

      navigate("/login", { unstable_viewTransition: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          setError("email", {
            message: "Email đã được sử dụng!",
          });
        } else {
          setError("root", {
            message: "Đăng ký thất bại!",
          });
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleEnterKeyEvent = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <form
      onSubmit={handleSubmit((data) => handleSignupFormSubmission(data))}
      className="w-full h-full flex justify-around"
    >
      <Card className="w-[80vw] sms_w-[30rem] m-auto shadow-slate-400 shadow-sm">
        <CardHeader>
          <CardTitle className="text-4xl mb-2">Đăng ký</CardTitle>
          <CardDescription>
            Nhập thông tin của bạn để tạo tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name" className="font-extrabold text-lg">
                Họ và tên
                <span className="text-red-600 ">*</span>
              </Label>
              <Input
                {...register("userName")}
                id="first-name"
                autoComplete="username"
                placeholder="Nguyễn Văn A"
                className="text-lg"
              />
              {errors.userName && (
                <div className="text-red-600">{errors.userName.message}</div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-extrabold text-lg">
                Email
                <span className="text-red-600 ">*</span>
              </Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="abc@gmail.com"
                className="text-lg"
              />
              {errors.email && (
                <div className="text-red-600">{errors.email.message}</div>
              )}
            </div>
            <div>
              <div className="flex flex-col sms_flex-row gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password" className="font-extrabold text-lg">
                    Mật khẩu
                    <span className="text-red-600 ">*</span>
                  </Label>
                  <span className="relative">
                    <Input
                      {...register("password")}
                      id="password"
                      type={passwordVisibility ? "text" : "password"}
                      autoComplete="new-password"
                      onKeyDown={(e) => handleEnterKeyEvent(e)}
                      className="pr-10 text-lg"
                    />
                    <button
                      className="cursor-pointer absolute right-2 top-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setPasswordvisibility(!passwordVisibility);
                      }}
                    >
                      {passwordVisibility ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </button>
                  </span>
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="retypePassword"
                    className="font-extrabold text-lg"
                  >
                    Nhập lại mật khẩu
                    <span className="text-red-600 ">*</span>
                  </Label>
                  <span className="relative">
                    <Input
                      {...register("retypePassword")}
                      id="retypePassword"
                      type={retypePasswordVisibility ? "text" : "password"}
                      autoComplete="new-password"
                      onKeyDown={(e) => handleEnterKeyEvent(e)}
                      className="text-lg"
                    />
                    <button
                      className="cursor-pointer absolute right-2 top-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setRetypePasswordvisibility(!retypePasswordVisibility);
                      }}
                    >
                      {retypePasswordVisibility ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </button>
                  </span>
                </div>
              </div>
              {errors.password && (
                <div className="text-red-600 mt-2">
                  {errors.password.message}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="neutral"
                className="w-full text-lg"
              >
                {!isSubmitting ? (
                  "Tạo tài khoản"
                ) : (
                  <LoadingSpinner size={26} className="text-white" />
                )}
              </Button>
              {errors.root && (
                <div className="text-red-600 mx-auto">
                  {errors.root.message}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 text-center text-lg">
            Bạn đã có tài khoản? &nbsp;
            <NavLink
              to="/login"
              className="underline text-nowrap hover_text-primary"
            >
              Đăng nhập
            </NavLink>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default Signup;
