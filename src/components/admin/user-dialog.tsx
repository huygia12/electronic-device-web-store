import { HTMLAttributes, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import { User } from "@/types/api";
import { buttonVariants } from "@/utils/constants";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";

interface UserDialogProps extends HTMLAttributes<HTMLFormElement> {
  user?: User;
  formTitle: string;
}

const UserDialog: React.FC<UserDialogProps> = ({ className, ...props }) => {
  const [hide, setHide] = useState(false);

  return (
    <form>
      <Dialog>
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent className="min-w-[60rem]">
          <DialogHeader className="min-h-10 mb-2">
            <DialogTitle className="text-[1.5rem]">
              {props.formTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 grid-rows-2">
            <div className="flex flex-col min-w-[6rem] py-6 mr-6 mb-10 bg-theme rounded-2xl">
              <Avatar className="w-32 h-32 mb-5 mx-auto">
                <AvatarImage src="/avt.jpg" alt="avt" className="w-32 h-32" />
                <AvatarFallback>AVT</AvatarFallback>
              </Avatar>
              <Input type="file" accept="image/**" className="mx-auto w-28" />
            </div>
            <div className="col-span-2 flex flex-col gap-8">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xl">
                  Họ và tên
                  <span className="text-red-600 ">*</span>
                </Label>
                <Input
                  id="name"
                  defaultValue={props.user?.userName ?? ""}
                  placeholder="Nguyễn Văn A"
                  className="h-full text-xl"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xl">
                  Email
                  <span className="text-red-600 ">*</span>
                </Label>
                <Input
                  id="email"
                  defaultValue={props.user?.email ?? ""}
                  placeholder="abc@gmail.com"
                  className="h-full text-xl"
                />
              </div>
            </div>
            <div className="col-span-3 space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="phoneNum" className="text-xl">
                  Số điện thoại:
                </Label>
                <Input
                  id="phoneNum"
                  type="text"
                  defaultValue={props.user?.phoneNumber ?? ""}
                  placeholder="+84"
                  className="h-full text-xl"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="passwd" className="text-xl">
                  Mật khẩu
                  <span className="text-red-600 ">*</span>
                </Label>
                <Input
                  id="passwd"
                  type={hide ? "password" : "text"}
                  className="h-full text-xl"
                />
                <button
                  className="self-end"
                  onClick={() => {
                    setHide(!hide);
                  }}
                >
                  {hide ? (
                    <span className="flex">
                      Hiển thị <Eye className="ml-2" />
                    </span>
                  ) : (
                    <span className="flex">
                      Che <EyeOff className="ml-2" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose
              type="submit"
              className={buttonVariants({ variant: "positive" })}
            >
              Lưu
            </DialogClose>
            <DialogClose className={buttonVariants({ variant: "negative" })}>
              Hủy
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default UserDialog;
