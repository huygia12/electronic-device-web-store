import { FC, HTMLAttributes, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormProps, UserSchema } from "@/utils/schema";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/effect";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/utils/helpers";
import { Button } from "@/components/ui/button";

interface UserDialogProps extends HTMLAttributes<HTMLFormElement> {
  user?: User;
  handleUpdateUser: (formProps: UserFormProps, avatarFile?: File) => void;
}

const UserUpdateDialog: FC<UserDialogProps> = ({ className, ...props }) => {
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

  useEffect(() => {
    if (props.user) {
      setValue("userName", props.user.userName);
      setValue("email", props.user.email);
      setValue("phoneNumber", props.user.phoneNumber || undefined);
    }
  }, [props.user]);

  const handleFormSubmission: SubmitHandler<UserFormProps> = async (data) => {
    props.handleUpdateUser(data, avatarFiles?.[0]);
    setValue("avatar", []);
  };

  return (
    <form>
      <Dialog>
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent className="max-w-[60rem] pr-2">
          <DialogHeader className="min-h-10 mb-2">
            <DialogTitle className="text-xl md_text-2xl">
              Sửa hồ sơ khách hàng
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(handleFormSubmission)}
            className="max-h-[80vh] overflow-y-scroll pr-4 py-2"
          >
            <div className="flex flex-col-reverse sms_grid sms_grid-cols-3 gap-8">
              <div className="sms_col-span-2 flex flex-col gap-4 text-sm md_text-lg">
                {/*USERNAME*/}
                <div>
                  <div className="flex">
                    <Label htmlFor="name" className="my-auto w-[14rem]">
                      Họ và tên
                      <span className="text-red-600 ">*</span>
                    </Label>
                    <Input
                      id="name"
                      {...register("userName")}
                      type="text"
                      defaultValue={props.user?.userName}
                      placeholder="Nguyễn Văn A"
                      className="h-full"
                    />
                  </div>
                  {errors.userName && (
                    <div className="text-red-600 mt-2 text-right">
                      {errors.userName.message}
                    </div>
                  )}
                </div>
                {/*EMAIL*/}
                <div>
                  <div className="flex">
                    <Label htmlFor="email" className="my-auto w-[14rem]">
                      Email
                      <span className="text-red-600 ">*</span>
                    </Label>
                    <Input
                      id="email"
                      {...register("email")}
                      type="text"
                      defaultValue={props.user?.email}
                      placeholder="abc@gmail.com"
                      className="h-full"
                    />
                  </div>
                  {errors.email && (
                    <div className="text-red-600 mt-2 text-right">
                      {errors.email.message}
                    </div>
                  )}
                </div>
                {/*SDT*/}
                <div>
                  <div className="flex">
                    <Label htmlFor="phoneNumber" className="my-auto w-[14rem]">
                      Số điện thoại:
                    </Label>
                    <Input
                      id="phoneNumber"
                      {...register("phoneNumber")}
                      defaultValue={props.user?.phoneNumber || undefined}
                      placeholder="+84"
                      className="h-full"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <div className="text-red-600 mt-2 text-right">
                      {errors.phoneNumber.message}
                    </div>
                  )}
                </div>
                {/*BUTTON*/}
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

              <div className="flex gap-8 justify-center">
                <Separator
                  orientation="vertical"
                  className="hidden sms_block"
                />
                <div className="flex flex-col w-full">
                  <Avatar className="size-[8rem] lgg_size-[12rem] max-w-[12rem] mx-auto border-2 border-opacity-40 border-black shadow-xl">
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
                    className="mx-auto mt-4 max-w-[15rem]"
                  />
                  <span className="flex flex-col mt-6 mx-auto text-xs md_text-sm text-muted-foreground">
                    <span className="text-center">
                      Dung lượng tối đa 1MB. Định dạng: .JPEG, .PNG
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default UserUpdateDialog;
