import { ProductSummary } from "@/types/payload";
import { useRouteLoaderData } from "react-router-dom";
import { FC, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { categoryService, productService, providerService } from "@/services";
import {
  UpperBar,
  ProductTable,
  ProductTools,
} from "@/components/product-management";
import { Category, Provider } from "@/types/model";
import { CustomPagination } from "@/components/common";
import { getPages } from "@/utils/helpers";

const ProductManagement: FC = () => {
  const searchingDelay = useRef<number>(2000);
  const initData = useRouteLoaderData("product_management") as {
    products: ProductSummary[];
    totalProducts: number;
  };
  const [products, setProducts] = useState<ProductSummary[]>(initData.products);
  const [totalPages, setTotalPages] = useState<number>(
    getPages(initData.totalProducts)
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary>();
  const [deepCleanProductID, setDeepCleanProductID] = useState<string>();
  const [searchingQuery, setSearchingQuery] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedProvider, setSelectedProvider] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>();
  const toasting = useRef<{
    id: string | number;
    state: boolean;
  } | null>();

  useEffect(() => {
    const setup = async () => {
      const categoriesRes = await categoryService.apis.getCategories();
      const providersRes = await providerService.apis.getProviders();

      setCategories(categoriesRes);
      setProviders(providersRes);
    };
    setup();
  }, []);

  useEffect(() => {
    if (toasting.current === undefined) {
      toasting.current = null;
    } else {
      if (!toasting.current?.state) {
        toasting.current = { id: toast.loading("Đang xử lý..."), state: true };
      }
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res: { products: ProductSummary[]; totalProducts: number } =
          await productService.apis.getProductsSummary({
            categoryID: selectedCategory,
            providerID: selectedProvider,
            searching: searchingQuery,
            currentPage: currentPage,
          });

        setProducts(res.products);
        setTotalPages(getPages(res.totalProducts));
      } finally {
        toast.dismiss(toasting.current!.id);
        toasting.current = null;
      }
    }, searchingDelay.current);

    return () => clearTimeout(delayDebounceFn);
  }, [searchingQuery, selectedCategory, selectedProvider, currentPage]);

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    const deleteProduct = productService.apis.deleteProduct(
      selectedProduct.productID,
      deepCleanProductID === selectedProduct.productID
    );

    toast.promise(deleteProduct, {
      loading: "Đang xử lý...",
      success: () => {
        setProducts(
          products.filter(
            (product) => product.productID !== selectedProduct.productID
          )
        );
        setSelectedProduct(undefined);
        setDeepCleanProductID(undefined);
        return "Xóa thành công!";
      },
      error: "Xóa thất bại!",
    });
  };

  const handleRefreshFilter = () => {
    setSelectedProduct(undefined);
    setSelectedCategory(undefined);
    setSelectedProvider(undefined);
  };

  return (
    <div className="my-8">
      {/**Search */}
      <UpperBar
        categories={categories}
        providers={providers}
        setSearchingInput={setSearchingQuery}
        selectedCategory={selectedCategory}
        selectedProvider={selectedProvider}
        setSelectedCategory={setSelectedCategory}
        setSelectedProvider={setSelectedProvider}
        handleRefreshFilter={handleRefreshFilter}
      />

      <div className="mt-4 flex gap-4">
        {/** Table */}
        <ProductTable
          className="flex-1 w-1"
          products={products}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />

        <ProductTools
          setDeepCleanProductID={setDeepCleanProductID}
          selectedProduct={selectedProduct}
          handleDeleteProduct={handleDeleteProduct}
        />
      </div>

      {/** Pagination */}
      <CustomPagination
        totalPages={totalPages}
        parentPageState={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ProductManagement;
