import { CategoryDialog } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/types/model";
import { arrayInReverse } from "@/utils/helpers";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { FC, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { toast } from "sonner";
import axios, { HttpStatusCode } from "axios";
import { buttonVariants } from "@/utils/constants";
import { Separator } from "@/components/ui/separator";
import categoryService from "@/services/category";

const colName: string[] = ["STT", "MÃ DANH MỤC", "TÊN DANH MỤC", "SỐ SẢN PHẨM"];

const CategoryManagement: FC = () => {
  const categoriesData = useRouteLoaderData(
    "category_management"
  ) as Category[];
  const [categories, setCategories] = useState(categoriesData);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [searchingInput, setSearchingInput] = useState("");

  const handleAddCategory = async (name: string) => {
    const processedName: string = name.trim();
    try {
      await categoryService.apis.addCategory(processedName);
      const fetchedCategories: Category[] =
        await categoryService.apis.getCategories();
      setCategories(fetchedCategories);
      toast.success("Thêm thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          toast.error("Thêm thất bại: danh mục này đã tồn tại!");
          return;
        }
        console.error(`Response data: ${error.response?.data}`);
        console.error(`Response status: ${error.response?.status})`);
      } else {
        console.error("Unexpected error:", error);
      }
      toast.error("Thêm thất bại!");
    }
  };

  const handleUpdateCategory = async (name: string) => {
    if (!selectedCategory) return;
    const processedName: string = name.trim();
    try {
      await categoryService.apis.updateCategory(
        selectedCategory.categoryID,
        processedName
      );
      const fetchedCategories: Category[] =
        await categoryService.apis.getCategories();
      setCategories(fetchedCategories);
      setSelectedCategory(undefined);
      toast.success("Thay đổi thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          toast.error("Thay đổi thất bại: danh mục này đã tồn tại!");
          return;
        }
        console.error(`Response data: ${error.response?.data}`);
        console.error(`Response status: ${error.response?.status})`);
      } else {
        console.error("Unexpected error:", error);
      }
      toast.error("Thay đổi thất bại!");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await categoryService.apis.deleteCategory(selectedCategory.categoryID);
      const fetchedCategories: Category[] =
        await categoryService.apis.getCategories();
      setCategories(fetchedCategories);
      setSelectedCategory(undefined);
      toast.success("Thay đổi thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          toast.error("Thay đổi thất bại: tồn tại sản phẩm liên quan!");
          return;
        }
        console.error(`Response data: ${error.response?.data}`);
        console.error(`Response status: ${error.response?.status})`);
      } else {
        console.error("Unexpected error:", error);
      }
      toast.error("Thay đổi thất bại!");
    }
  };

  return (
    <section>
      <div className="relative h-[3rem] mt-8 mb-4">
        <Search className="absolute left-4 top-3 h-6 w-6 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Tìm kiếm..."
          className="h-full text-lg w-full rounded-xl bg-background pl-14 focus-visible_!ring-0 focus-visible_!ring-offset-0"
          onChange={(e) => setSearchingInput(e.target.value)}
        />
      </div>

      {/** Table */}
      <div className="flex gap-4">
        <Card className="rounded-2xl shadow-lg flex-1">
          <CardContent className="flex flex-col p-4">
            {categories.length !== 0 ? (
              <ScrollArea className="relative h-[58vh]">
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
                    {arrayInReverse(categories)
                      .filter((cate) =>
                        cate.categoryName
                          .toLowerCase()
                          .includes(searchingInput.toLowerCase())
                      )
                      .map((cate, index) => (
                        <TableRow
                          key={index}
                          className={
                            selectedCategory &&
                            (cate.categoryID === selectedCategory.categoryID
                              ? "bg-theme-softer"
                              : "")
                          }
                          onClick={() => setSelectedCategory(cate)}
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
            ) : (
              <div className="flex flex-col items-center">
                <img width={500} src="/empty-box.svg" alt="emptyCart" />
                <span className="text-xl font-medium text-slate-500 mb-10">
                  Bạn chưa có danh mục nào!
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-4 space-y-4 contain-content">
            <CategoryDialog
              formTitle="Thêm danh mục mới"
              handleDialogAcceptEvent={handleAddCategory}
            >
              <Button className="" variant="positive">
                <Plus />
              </Button>
            </CategoryDialog>
            {selectedCategory ? (
              <>
                <CategoryDialog
                  formTitle="Sửa thông tin danh mục"
                  category={selectedCategory}
                  handleDialogAcceptEvent={handleUpdateCategory}
                >
                  <Button variant="neutral">
                    <SquarePen />
                  </Button>
                </CategoryDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="negative">
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bạn muốn xóa?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Hành động này sẽ trực tiếp xóa danh mục và không thể
                        hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction
                        onClick={() => handleDeleteCategory()}
                        className={buttonVariants({
                          variant: "negative",
                        })}
                      >
                        Xóa
                      </AlertDialogAction>
                      <AlertDialogCancel className="mt-0">
                        Hủy
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <SquarePen className="mx-4 !mt-6" />
                <Trash2 className="mx-4 !mt-6" />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CategoryManagement;
