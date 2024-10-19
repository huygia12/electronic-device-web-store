import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Attribute, Product } from "@/types/model";
import { attributeService, productService } from "@/services";
import { Sort } from "@/types/enum";
import {
  AttributeFilter,
  FilterProductTools,
  ProductList,
} from "@/components/product-filter";
import { CustomPagination } from "@/components/common";
import { getPages } from "@/utils/helpers";

const FilteredProductList: FC = () => {
  const [products, setProducts] = useState<Product[]>();
  const [numberOfProducts, setNumberOfProducts] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>();
  const [attributes, setAttributes] = useState<Attribute[]>();

  const [recaculate, setRecaculate] = useState<boolean>(true);
  const params = useMemo(
    () => new URLSearchParams(window.location.search),
    [recaculate]
  );
  const totalPages = useMemo(
    () => (numberOfProducts ? getPages(numberOfProducts, 12) : 0),
    [numberOfProducts]
  );

  const fetchProducts = useCallback(
    async (additionParams?: Record<string, string>) => {
      const records = Object.fromEntries([...params]);
      const response = await productService.apis.getProductsFullJoin({
        ...records,
        ...additionParams,
      });
      setProducts(response.products);
      setNumberOfProducts(response.totalProducts);
    },
    [params]
  );

  useEffect(() => {
    const setup = async () => {
      const categoryID: string | null = params.get("categoryID");
      const providerID: string | null = params.get("providerID");

      const attributesRes = await attributeService.apis.getAttributes({
        categoryID: categoryID || undefined,
        providerID: providerID || undefined,
      });
      setAttributes(attributeService.filterEmtyAttributeOptions(attributesRes));

      fetchProducts();
    };

    setup();
  }, []);

  useEffect(() => {
    const getNextPage = () => {
      fetchProducts({ currentPage: `${currentPage}` });
    };

    getNextPage();
  }, [currentPage]);

  const handleSortSelectionEvent = (value: Sort) => {
    let filterKey, filterValue;
    const name = "sortByName";
    const price = "sortByPrice";

    if (value === Sort.ASC || value === Sort.DES) {
      filterKey = price;
      filterValue = value === Sort.ASC ? "ASC" : "DESC";
    } else {
      filterKey = name;
      filterValue = value === Sort.ATOZ ? "ASC" : "DESC";
    }
    handleFilterChange([
      { filterKey, filterValue },
      { filterKey: filterKey === name ? price : name, filterValue: undefined },
    ]);
  };

  const handleAttributeOptionSelection = (
    optionID: string,
    attribute: Attribute
  ) => {
    //update selected options to url
    const currentFilter = params.get("optionIDs") || "";
    let filterArray = currentFilter.split(",").filter(Boolean);

    if (!filterArray.includes(optionID)) {
      filterArray = filterArray.filter(
        (e) => !attributeService.findAttributeOption(attribute, e)
      );
      filterArray.push(optionID);
    }
    handleFilterChange([{ filterKey: "optionIDs", filterValue: filterArray }]);
  };

  const handleResetSelectedAttributeOption = () => {
    handleFilterChange([{ filterKey: "optionIDs", filterValue: undefined }]);
    window.scrollTo(0, 0);
  };

  const handleSaleFilterChange = (value: boolean) => {
    handleFilterChange([
      { filterKey: "sale", filterValue: value ? `${value}` : undefined },
    ]);
  };

  const handlePriceRangeChange = (values: number[]) => {
    handleFilterChange([
      { filterKey: "minPrice", filterValue: `${values[0]}` },
      { filterKey: "maxPrice", filterValue: `${values[1]}` },
    ]);
  };

  const handleFilterChange = (
    queryParams: {
      filterKey: string;
      filterValue: string | undefined | string[];
    }[]
  ) => {
    const currentUrl = new URL(window.location.href);

    queryParams.forEach((queryParam) => {
      if (queryParam.filterValue) {
        currentUrl.searchParams.set(
          queryParam.filterKey,
          typeof queryParam.filterValue === "string"
            ? queryParam.filterValue
            : queryParam.filterValue.join(",")
        );
      } else {
        currentUrl.searchParams.delete(queryParam.filterKey);
      }
    });

    window.history.replaceState({}, "", currentUrl);
    setRecaculate((prevValue) => !prevValue);
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-8">
        <div>
          <AttributeFilter
            params={params}
            attributes={attributes}
            onReset={handleResetSelectedAttributeOption}
            onOptionSelected={handleAttributeOptionSelection}
            className="sticky top-36"
          />
        </div>

        <div className="col-span-3 flex flex-col gap-6">
          <div>
            <h1 className="text-[1.6rem] font-semibold mb-[0.5rem]">
              {numberOfProducts !== undefined ? (
                <>
                  Kết Quả Lọc Cho:{" "}
                  <span className="text-[1.4rem] text-red-600 font-light">{`(${numberOfProducts} kết quả)`}</span>
                </>
              ) : (
                <>Tìm Kiếm ...</>
              )}
            </h1>
            <hr className="border-dashed border-[0.1rem] border-secondary-foreground" />
          </div>

          <FilterProductTools
            onFilter={fetchProducts}
            onSaleFilterChange={handleSaleFilterChange}
            onPriceRangeChange={handlePriceRangeChange}
            onSortSelection={handleSortSelectionEvent}
          />

          <ProductList products={products} />

          {/** Pagination */}
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            className="mt-auto"
          />
        </div>
      </div>
    </div>
  );
};
export default FilteredProductList;
