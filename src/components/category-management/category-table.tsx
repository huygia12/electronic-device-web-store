import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/types/model";
import { FC, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const colName: string[] = ["STT", "MÃ DANH MỤC", "TÊN DANH MỤC", "SỐ SẢN PHẨM"];

interface CategoryTableProps extends HTMLAttributes<HTMLDivElement> {
  categories: Category[];
  selectedCategory: Category | undefined;
  setSelectedCategory: (category: Category) => void;
}

const CategoryTable: FC<CategoryTableProps> = ({ ...props }) => {
  if (props.categories.length === 0) {
    return (
      <Card className={cn("rounded-2xl shadow-lg ", props.className)}>
        <CardContent className="flex flex-col p-4 h-[60vh]">
          <div className="flex flex-col items-center">
            <img width={500} src="/empty-box.svg" alt="emptyCart" />
            <span className="text-xl font-medium text-slate-500 mb-10">
              Bạn chưa có danh mục nào!
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("rounded-2xl shadow-lg", props.className)}>
      <CardContent className="flex flex-col p-4">
        <ScrollArea className="relative h-[56vh]">
          <Table>
            <TableHeader className="z-10 border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
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
              {props.categories.map((cate, index) => (
                <TableRow
                  key={index}
                  className={cn(
                    "cursor-pointer",
                    props.selectedCategory?.categoryID === cate.categoryID &&
                      "bg-theme-softer"
                  )}
                  onClick={() => props.setSelectedCategory(cate)}
                >
                  <TableCell className="text-center text-base">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-center text-base">
                    {cate.categoryID}
                  </TableCell>
                  <TableCell className="text-center  text-base">
                    {cate.categoryName}
                  </TableCell>
                  <TableCell className="text-center text-base">
                    {cate.productQuantity || "0"}
                  </TableCell>
                </TableRow>
              ))}
              <tr>
                <td>
                  <Separator />
                </td>
              </tr>
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CategoryTable;
