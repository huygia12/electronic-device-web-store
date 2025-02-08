import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Separator } from "@/components/ui/separator";
import { UserFormProps, UserSchema } from "@/utils/schema";
import { User } from "@/types/model";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FC, HTMLAttributes } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { firebaseService, userService } from "@/services";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/effect";
import { getImageUrl } from "@/utils/helpers";
import useCurrentUser from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

const ChangeProfileCard: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormProps>({
    resolver: zodResolver(UserSchema),
  });
  const { currentUser, setCurrentUser } = useCurrentUser();
  const avatarFiles = watch("avatar");

  const handleUserUpdateFormSubmission: SubmitHandler<UserFormProps> = async (
    data
  ) => {
    let newAvatarUrl: string | undefined;
    try {
      const updatedUserInfor: User = await userService.apis.updateUser(
        currentUser!.userID,
        {
          userName: data.userName.trim(),
          email: data.email.trim(),
          phoneNumber: data.phoneNumber,
          avatar: newAvatarUrl,
        },
        currentUser!,
        avatarFiles[0]
      );

      toast.success("Cập nhật thành công!");
      setCurrentUser(updatedUserInfor);
      setValue("avatar", []);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError("root", {
          message: error.response?.data.message || error.message,
        });
      } else {
        console.error("Unexpected error:", error);
      }

      if (newAvatarUrl) {
        firebaseService.apis.deleteImagesInFireBase([newAvatarUrl]);
      }

      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <Card className="w-[90vw] xl_w-full pb-10">
      <CardHeader>
        <CardTitle>Hồ sơ của tôi</CardTitle>
        <CardDescription>
          Quản lý thông tin hồ sơ để bảo mật tài khoản.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleUserUpdateFormSubmission)}
          className="flex flex-col-reverse sm_grid sm_grid-cols-3 gap-10"
        >
          <div className="col-span-2 flex flex-col gap-4">
            <div>
              <div className="flex">
                <Label htmlFor="name" className="text-lg my-auto w-[15rem]">
                  Họ và tên
                  <span className="text-red-600 ">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("userName")}
                  type="text"
                  defaultValue={currentUser?.userName}
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
                <Label htmlFor="email" className="text-lg my-auto w-[15rem]">
                  Email
                  <span className="text-red-600 ">*</span>
                </Label>
                <Input
                  id="email"
                  {...register("email")}
                  type="text"
                  defaultValue={currentUser?.email}
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
                  className="text-lg my-auto w-[15rem]"
                >
                  Số điện thoại:
                </Label>
                <Input
                  id="phoneNumber"
                  {...register("phoneNumber")}
                  defaultValue={currentUser?.phoneNumber || undefined}
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
            <div className="flex">
              {errors.root && (
                <div className="text-red-600 my-auto ml-auto mr-8 text-right">
                  {errors.root.message}
                </div>
              )}
              <Button
                disabled={isSubmitting}
                variant="negative"
                className={cn("mt-auto", !errors.root && "ml-auto")}
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
            <Separator orientation="vertical" className="hidden sm_block" />
            <div className="flex flex-col w-full">
              <Avatar className="size-[8rem] xl_size-[12rem] mx-auto">
                <AvatarImage
                  src={
                    (avatarFiles && getImageUrl(avatarFiles[0])) ||
                    currentUser?.avatar ||
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
                className="mx-auto mt-4 w-[14rem] sm_w-[12vw] xl_w-[14rem]"
              />
              <span className="flex flex-col mt-6 mx-auto text-sm text-muted-foreground">
                <span>Dung lượng tối đa 1MB</span>
                <span>Định dạng: .JPEG, .PNG</span>
              </span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangeProfileCard;
