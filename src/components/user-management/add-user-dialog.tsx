import { HTMLAttributes, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/utils/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormProps, SignupSchema } from "@/utils/schema";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/effect";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface UserDialogProps extends HTMLAttributes<HTMLDivElement> {
  handleAddUser: (formProps: SignupFormProps, avatarFile?: File) => void;
}

const AddUserDialog: React.FC<UserDialogProps> = ({ className, ...props }) => {
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [retypePasswordVisible, setRetypePasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormProps>({
    resolver: zodResolver(SignupSchema),
  });
  const avatarFiles = watch("avatar");

  const handleFormSubmission: SubmitHandler<SignupFormProps> = (data) => {
    if (data.retypePassword != data.password) {
      setError("retypePassword", {
        message: "Mật khẩu nhập lại không khớp!",
      });
      return;
    }

    props.handleAddUser(data, avatarFiles?.[0]);
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="min-w-[60rem]">
        <DialogHeader className="min-h-10 mb-2">
          <DialogTitle className="text-[1.5rem]">
            Thêm hồ sơ khách hàng
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleFormSubmission)}
          className="grid grid-cols-3 gap-10 mb-6"
        >
          <div className="col-span-2 flex flex-col gap-4">
            <div>
              <div className="flex">
                <Label htmlFor="name" className="text-lg my-auto w-[20rem]">
                  Họ và tên
                  <span className="text-red-600 ">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("userName")}
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="h-full text-lg"
                />
              </div>
              {errors.userName && (
                <div className="text-red-600 mt-2 text-right">
                  {errors.userName.message}
                </div>
              )}
            </div>
            <div>
              <div className="flex">
                <Label htmlFor="email" className="text-lg my-auto w-[20rem]">
                  Email
                  <span className="text-red-600 ">*</span>
                </Label>
                <Input
                  id="email"
                  {...register("email")}
                  type="text"
                  autoComplete="email"
                  placeholder="abc@gmail.com"
                  className="h-full text-lg"
                />
              </div>
              {errors.email && (
                <div className="text-red-600 mt-2 text-right">
                  {errors.email.message}
                </div>
              )}
            </div>
            <div>
              <div className="flex">
                <Label
                  htmlFor="phoneNumber"
                  className="text-lg my-auto w-[20rem]"
                >
                  Số điện thoại:
                </Label>
                <Input
                  id="phoneNumber"
                  {...register("phoneNumber")}
                  placeholder="+84"
                  className="h-full text-lg"
                />
              </div>
              {errors.phoneNumber && (
                <div className="text-red-600 mt-2 text-right">
                  {errors.phoneNumber.message}
                </div>
              )}
            </div>
            <div>
              <div className="flex relative">
                <Label
                  htmlFor="new-password"
                  className="text-lg my-auto w-[20rem]"
                >
                  Mật khẩu
                  <span className="text-red-600 ">*</span>
                </Label>
                <Input
                  id="new-password"
                  {...register("password")}
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
              {errors.password && (
                <div className="text-red-600 mt-2 text-right">
                  {errors.password.message}
                </div>
              )}
            </div>
            <div>
              <div className="flex relative">
                <Label
                  htmlFor="retype-password"
                  className="text-lg my-auto w-[20rem]"
                >
                  Nhập lại mật khẩu
                  <span className="text-red-600 ">*</span>
                </Label>
                <Input
                  id="retype-password"
                  {...register("retypePassword")}
                  type={!retypePasswordVisible ? "password" : "text"}
                  autoComplete="new-password"
                  className="h-full text-lg pr-10"
                />
                <button
                  className="absolute text-muted-foreground right-2 bottom-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setRetypePasswordVisible(!retypePasswordVisible);
                  }}
                >
                  {retypePasswordVisible ? (
                    <Eye className="ml-2" />
                  ) : (
                    <EyeOff className="ml-2" />
                  )}
                </button>
              </div>
              {errors.retypePassword && (
                <div className="text-red-600 mt-2 text-right">
                  {errors.retypePassword.message}
                </div>
              )}
            </div>
            <div className="flex">
              {errors.root && (
                <div className="text-red-600 my-auto ml-auto mr-8 text-right">
                  {errors.root.message}
                </div>
              )}
              <Button
                disabled={isSubmitting}
                className={cn(
                  "mt-auto",
                  buttonVariants({ variant: "positive" }),
                  !errors.root && "ml-auto"
                )}
              >
                {!isSubmitting ? (
                  "Lưu"
                ) : (
                  <>
                    <LoadingSpinner size={26} className="text-white" />
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="col-span-1 flex gap-8">
            <Separator orientation="vertical" />
            <div className="flex flex-col w-full">
              <Avatar className="size-[12rem] mx-auto">
                <AvatarImage
                  src={
                    (avatarFiles &&
                      avatarFiles?.[0] &&
                      getImageUrl(avatarFiles[0])) ||
                    "/blankAvt.jpg"
                  }
                  alt="avt"
                />
                <AvatarFallback>AVT</AvatarFallback>
              </Avatar>
              <Input
                type="file"
                {...register("avatar")}
                accept="image/*"
                className="mx-auto mt-14 min-w-[14rem]"
              />
              <span className="flex flex-col mt-6 mx-auto text-sm text-muted-foreground">
                <span>Dung lượng tối đa 1MB</span>
                <span>Định dạng: .JPEG, .PNG</span>
              </span>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
