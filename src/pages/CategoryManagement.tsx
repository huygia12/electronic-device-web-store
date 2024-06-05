import { CategoryDialog } from "@/components/categoryDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/declare";
import { arrayInReverse } from "@/utils/helpers";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";

const colName: string[] = [
  "STT",
  "TÊN DANH MỤC",
  "MÃ DANH MỤC",
  "SỐ SẢN PHẨM",
  "THAO TÁC",
];

const CategoryManagement = () => {
  const categoriesData = useRouteLoaderData(
    "category_management"
  ) as Category[];
  const [existingCategories, setExistingCategories] = useState(categoriesData);
  // const [selectedName, setSelectedName] = useState("");

  const handleAddCategory = (newCategoryName: string) => {
    // Check if the name is already existed or not
    let checkExisting: boolean = false;
    existingCategories.forEach((cate) => {
      newCategoryName.length !== 0 &&
        cate.name.toLowerCase() === newCategoryName.toLowerCase() &&
        (checkExisting = true);
    });

    const tempCategories = existingCategories.map((e) => e);
    if (checkExisting) {
      console.log("Already exist!");
    } else {
      // Add to current category list
      tempCategories.push({ id: "", name: newCategoryName, products: 0 });
      setExistingCategories(tempCategories);
    }
  };

  const handleDeleteCategory = (categoryID: string) => {
    const temp = existingCategories.filter(
      (category) => category.id !== categoryID
    );
    setExistingCategories(temp);
  };

  return (
    <>
      <Card className="rounded-2xl shadow-lg my-8">
        <CardContent className="flex justify-between p-6">
          <CategoryDialog
            formTitle="Thêm danh mục mới"
            handleAcceptEvent={(newCategoryName: string) =>
              handleAddCategory(newCategoryName)
            }
          >
            <Button variant="positive" className="text-xl">
              Thêm danh mục mới
              <Plus />
            </Button>
          </CategoryDialog>
          <div className="relative flex-1 md_grow-0 h-[2.5rem]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm..."
              className="h-full text-xl w-full rounded-lg bg-background pl-8 md_w-[200px] lg_w-[336px]"
            />
          </div>
        </CardContent>
      </Card>

      {/** Table */}
      <Card className="rounded-2xl shadow-lg mb-8">
        <CardHeader className="py-6 px-10">
          <CardTitle className="text-8">Phân loại danh mục</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col px-6 pb-4">
          <div className="overflow-auto relative h-[58vh]">
            <Table>
              <TableHeader className="border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
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
                {arrayInReverse(existingCategories).map((cate, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center text-base">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-center  text-base">
                      {cate.name}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {cate.id}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {cate.products}
                    </TableCell>
                    <TableCell className="flex items-center justify-center space-x-2">
                      <CategoryDialog
                        formTitle="Sửa thông tin danh mục"
                        category={cate}
                        // selectedCategoryLastValue={selectedName}
                        handleAcceptEvent={(name: string) =>
                          handleAddCategory(name)
                        }
                      >
                        <Button variant="neutral">
                          <SquarePen />
                        </Button>
                      </CategoryDialog>
                      <Button
                        variant="negative"
                        onClick={() => handleDeleteCategory(cate.id)}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/** Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default CategoryManagement;
