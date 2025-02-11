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

interface CategoryTableProps extends HTMLAttributes<HTMLDivElement> {
  categories: Category[];
  selectedCategory: Category | undefined;
  setSelectedCategory: (category: Category) => void;
}

const CategoryTable: FC<CategoryTableProps> = ({ ...props }) => {
  if (props.categories.length === 0) {
    return (
      <Card className={cn("rounded-md shadow-lg ", props.className)}>
        <CardContent className="flex flex-col p-0 xss_p-4 h-[60vh] min-h-fit">
          <div className="flex flex-col items-center">
            <img width={500} src="/empty-box.svg" alt="emptyCart" />
            <span className="text-base md_text-xl font-medium text-slate-500 mb-10">
              Bạn chưa có danh mục nào!
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("rounded-md shadow-lg", props.className)}>
      <CardContent className="flex flex-col p-0 xss_p-4">
        <ScrollArea className="relative h-[56vh]">
          <Table>
            <TableHeader className="z-10 border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
              <tr className="text-black text-xs md_text-base">
                <TableHead className="text-center font-extrabold">
                  STT
                </TableHead>
                <TableHead className="text-center font-extrabold hidden lgg_block">
                  MÃ DANH MỤC
                </TableHead>
                <TableHead className="text-center font-extrabold">
                  TÊN DANH MỤC
                </TableHead>
                <TableHead className="text-center font-extrabold">
                  SỐ SẢN PHẨM
                </TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {props.categories.map((cate, index) => (
                <TableRow
                  key={index}
                  className={cn(
                    "cursor-pointer text-sm md_text-base",
                    props.selectedCategory?.categoryID === cate.categoryID &&
                      "bg-theme-softer"
                  )}
                  onClick={() => props.setSelectedCategory(cate)}
                >
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center hidden lgg_block">
                    {cate.categoryID}
                  </TableCell>
                  <TableCell className="text-center">
                    {cate.categoryName}
                  </TableCell>
                  <TableCell className="text-center">
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
