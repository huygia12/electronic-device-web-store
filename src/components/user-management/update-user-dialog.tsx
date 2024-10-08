import { HTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/types/model";
import { buttonVariants } from "@/utils/constants";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormProps, UserSchema } from "@/utils/schema";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "../effect";
import { Separator } from "../ui/separator";
import { getImageUrl } from "@/utils/helpers";
import { Button } from "../ui/button";

interface UserDialogProps extends HTMLAttributes<HTMLFormElement> {
  user?: User;
  handleUpdateUser: (formProps: UserFormProps, avatarFile?: File) => void;
}

const UpdateUserDialog: React.FC<UserDialogProps> = ({
  className,
  ...props
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormProps>({
    resolver: zodResolver(UserSchema),
  });
  const avatarFiles = watch("avatar");

  const handleFormSubmission: SubmitHandler<UserFormProps> = async (data) => {
    props.handleUpdateUser(data, avatarFiles?.[0]);
    setValue("avatar", []);
  };

  return (
    <form>
      <Dialog>
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent className="min-w-[60rem]">
          <DialogHeader className="min-h-10 mb-2">
            <DialogTitle className="text-[1.5rem]">
              Sửa hồ sơ khác hàng
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
                    defaultValue={props.user?.userName}
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
                    defaultValue={props.user?.email}
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
                    defaultValue={props.user?.phoneNumber || undefined}
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
                      props.user!.avatar ||
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
    </form>
  );
};

export default UpdateUserDialog;
