import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HTMLAttributes } from "react";
import { ProductAttribute } from "@/declare";
import { buttonVariants } from "@/utils/helpers";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface AttibuteOptionDialogProps extends HTMLAttributes<HTMLFormElement> {
  attribute?: ProductAttribute;
  formTitle: string;
}

const colName: string[] = ["STT", "TÊN GIÁ TRỊ", "ID", "THAO TÁC"];

const AttributeOptionDialog: React.FC<AttibuteOptionDialogProps> = ({
  className,
  ...props
}) => {
  return (
    <form>
      <Dialog>
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{props.formTitle}</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto relative h-[50vh] border-b-slate-200 border-2 rounded-lg">
            <Table>
              <TableHeader className="border-b-secondary-foreground shadow-lg bg-white border-b-2 sticky top-0">
                <tr>
                  {colName.map((item, key) => {
                    return (
                      <TableHead
                        key={key}
                        className=" text-center text-black font-extrabold text-[1rem]"
                      >
                        {item}
                      </TableHead>
                    );
                  })}
                </tr>
              </TableHeader>
              <TableBody>
                {props.attribute?.values.map((attr, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center text-base">
                      {index}
                    </TableCell>
                    <TableCell className="text-center  text-base">
                      {attr.name}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {attr.id}
                    </TableCell>
                    <TableCell
                      colSpan={3}
                      className="flex items-center justify-center space-x-2"
                    >
                      <Button variant="negative">
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <DialogClose
              type="submit"
              className={buttonVariants({
                variant: "positive",
              })}
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

export { AttributeOptionDialog };
