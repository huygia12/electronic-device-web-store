import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { toast } from "sonner";

const FilteredProductList: FC = () => {
  const searchingDelay = useRef<number>(1000);
  const [products, setProducts] = useState<Product[]>();
  const [numberOfProducts, setNumberOfProducts] = useState<number>();
  const [attributes, setAttributes] = useState<Attribute[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterChange, setFilterChange] = useState<boolean>(true);
  const params = useMemo(
    () => new URLSearchParams(window.location.search),
    [filterChange]
  );
  const totalPages = useMemo(
    () => (numberOfProducts ? getPages(numberOfProducts, 12) : 0),
    [numberOfProducts]
  );
  const toasting = useRef<{
    id: string | number;
    state: boolean;
  } | null>();

  const fetchProducts = useCallback(async () => {
    const records = Object.fromEntries([...params]);
    const response = await productService.apis.getProductsFullJoin({
      ...records,
    });
    setProducts(response.products);
    setNumberOfProducts(response.totalProducts);
    window.scrollTo(0, 0);
  }, [params]);

  useEffect(() => {
    const setup = async () => {
      const categoryID: string | null = params.get("categoryID");
      const providerID: string | null = params.get("providerID");

      const attributesRes = await attributeService.apis.getAttributes({
        categoryID: categoryID || undefined,
        providerID: providerID || undefined,
      });
      setAttributes(attributeService.filterEmtyAttributeOptions(attributesRes));
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
        await fetchProducts();
      } finally {
        toast.dismiss(toasting.current!.id);
        toasting.current = null;
      }
    }, searchingDelay.current);

    return () => clearTimeout(delayDebounceFn);
  }, [filterChange]);

  const handleSortSelectionEvent = (value: Sort) => {
    let filterKey, filterValue;
    const name = "sortByName";
    const price = "sortByPrice";

    if (value === Sort.ASC || value === Sort.DES) {
      filterKey = price;
      filterValue = value === Sort.ASC ? "ASC" : "DESC";
    } else {
      filterKey = name;
      filterValue = value === Sort.ATOZ ? "DESC" : "ASC";
    }
    editQueryUrl([
      { filterKey, filterValue },
      { filterKey: filterKey === name ? price : name, filterValue: undefined },
    ]);
  };

  const handleAttributeOptionSelection = (
    newSelectedOptionID: string,
    attribute: Attribute
  ) => {
    //update selected options to url
    const currentFilter = params.get("optionIDs") || "";
    let selectedOptionIds: string[] = currentFilter.split(",").filter(Boolean);
    let optionIsSelected = false;

    //clear all the previously selected options and
    // also check if the selected option had already been selected or not
    selectedOptionIds = selectedOptionIds.filter(
      (prevSelectedAttributeOptionId) => {
        if (prevSelectedAttributeOptionId === newSelectedOptionID) {
          optionIsSelected = true;
        }
        return !attributeService.findAttributeOption(
          attribute,
          prevSelectedAttributeOptionId
        );
      }
    );

    if (!optionIsSelected) {
      selectedOptionIds.push(newSelectedOptionID);
    }
    setCurrentPage(1);
    editQueryUrl([
      { filterKey: "optionIDs", filterValue: selectedOptionIds },
      { filterKey: "currentPage", filterValue: `${1}` },
    ]);
  };

  const handleResetSelectedAttributeOption = () => {
    setCurrentPage(1);
    editQueryUrl([
      { filterKey: "optionIDs", filterValue: undefined },
      { filterKey: "currentPage", filterValue: `${1}` },
    ]);
  };

  const handleSaleFilterChange = (value: boolean) => {
    setCurrentPage(1);
    editQueryUrl([
      { filterKey: "sale", filterValue: value ? `${value}` : undefined },
      { filterKey: "currentPage", filterValue: `${1}` },
    ]);
  };

  const handlePriceRangeChange = (values: number[]) => {
    setCurrentPage(1);
    editQueryUrl([
      { filterKey: "minPrice", filterValue: `${values[0]}` },
      { filterKey: "maxPrice", filterValue: `${values[1]}` },
      { filterKey: "currentPage", filterValue: `${1}` },
    ]);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    editQueryUrl([{ filterKey: "currentPage", filterValue: `${pageNumber}` }]);
  };

  const editQueryUrl = (
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
    setFilterChange((prevValue) => !prevValue);
  };

  return (
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
                Kết Quả Lọc Cho: &nbsp;
                <span className="text-[1.4rem] text-red-600 font-light">{`(${numberOfProducts} kết quả)`}</span>
              </>
            ) : (
              <>Tìm Kiếm ...</>
            )}
          </h1>
          <hr className="border-dashed border-[0.1rem] border-secondary-foreground" />
        </div>

        <FilterProductTools
          onSaleFilterChange={handleSaleFilterChange}
          onPriceRangeChange={handlePriceRangeChange}
          onSortSelection={handleSortSelectionEvent}
        />

        <ProductList products={products} className="col-span-3" />

        {/** Pagination */}
        <CustomPagination
          parentPageState={currentPage}
          totalPages={totalPages}
          onPageChange={(pageNumber) => handlePageChange(pageNumber)}
        />
      </div>
    </div>
  );
};
export default FilteredProductList;
