import { Category } from "@/types/model";
import { FC, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { toast } from "sonner";
import axios, { HttpStatusCode } from "axios";
import categoryService from "@/services/category";
import { SearchBox } from "@/components/common";
import { CategoryTable, CategoryTools } from "@/components/category-management";

const CategoryManagement: FC = () => {
  const categoriesData = useRouteLoaderData(
    "category_management"
  ) as Category[];
  const [categories, setCategories] = useState(categoriesData);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [searchText, setSearchText] = useState("");

  const handleAddCategory = async (value: string) => {
    const addProvider = categoryService.apis.addCategory(value.trim());

    toast.promise(addProvider, {
      loading: "Đang xử lý...",
      success: (category: Category) => {
        setCategories(categoryService.addCategory(category, categories));
        setSelectedCategory(undefined);
        return "Thêm thành công!";
      },
      error: (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == HttpStatusCode.Conflict) {
            return "Thêm thất bại: thẻ loại này đã tồn tại!";
          }
        }
        return "Thêm thất bại!";
      },
    });
  };

  const handleUpdateCategory = async (value: string) => {
    if (!selectedCategory) return;

    const updateCategory = categoryService.apis.updateCategory(
      selectedCategory.categoryID,
      value.trim()
    );

    toast.promise(updateCategory, {
      loading: "Đang xử lý...",
      success: (category: Category) => {
        setCategories(categoryService.updateCategory(category, categories));
        return "Thay đổi thành công!";
      },
      error: (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == HttpStatusCode.Conflict) {
            return "Thay đổi thất bại: thể loại này đã tồn tại!";
          }
        }
        return "Thay đổi thất bại!";
      },
    });
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    const deleteCategory = categoryService.apis.deleteCategory(
      selectedCategory.categoryID
    );

    toast.promise(deleteCategory, {
      loading: "Đang xử lý...",
      success: () => {
        setCategories(
          categoryService.deleteCategory(selectedCategory, categories)
        );
        setSelectedCategory(undefined);
        return "Xóa thành công!";
      },
      error: () => {
        return "Xóa thất bại!";
      },
    });
  };

  return (
    <section>
      <SearchBox className="mt-8 mb-4" setSearchText={setSearchText} />

      {/** Table */}
      <div className="flex gap-4">
        <CategoryTable
          className="flex-1"
          categories={categoryService.getSearchingResult(
            searchText,
            categories
          )}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <CategoryTools
          selectedCategory={selectedCategory}
          handleAddCategory={handleAddCategory}
          handleUpdateCategory={handleUpdateCategory}
          handleDeleteCategory={handleDeleteCategory}
        />
      </div>
    </section>
  );
};

export default CategoryManagement;
