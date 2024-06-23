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
import { NavLink, useLocation } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import axios, { HttpStatusCode } from "axios";
import { reqConfig } from "@/utils/axiosConfig";
import { useCurrAccount } from "@/utils/customHook";
import { publicRoutes } from "./routes";
import log from "loglevel";
import { AccountSummary } from "@/declare";

const LoginSchema = z.object({
  email: z.string().email({ message: "Email không đúng định dạng!" }),
  password: z.string().min(6, { message: "Mật khẩu chứa tối thiểu 6 kí tự!" }),
});

type LoginForm = z.infer<typeof LoginSchema>;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000, // Timeout set to 5 seconds
});

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });
  const location = useLocation();
  const from: string = location.state?.from?.pathname ?? "/";
  const { setCurrAccount } = useCurrAccount();

  const handleLoginFormSubmission: SubmitHandler<LoginForm> = async (data) => {
    try {
      const res = await axiosInstance.post<{
        message: string;
        info: AccountSummary;
      }>(
        "/user/login",
        {
          email: data.email,
          password: data.password,
        },
        reqConfig
      );
      const account: AccountSummary = res.data.info;
      setCurrAccount(account);
      console.log(from);
      await publicRoutes.navigate(
        account.role === "ADMIN" ? "/admin" : from === "/login" ? "/" : from,
        {
          unstable_viewTransition: true,
          replace: true,
        }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          setError("root", {
            message: "Bạn chưa logout tài khoản hiện tại!",
          });
        } else if (error.response?.status == HttpStatusCode.BadRequest) {
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
        if (error.response) {
          log.warn(`Response data: ${error.response.data}`);
          log.warn(`Response status: ${error.response.status})`);
        }
      } else {
        log.error("Unexpected error:", error);
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
        <CardFooter className="flex flex-col justify-center">
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
            <div className="text-red-600 mt-4">{errors.root.message}</div>
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
