import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import PriceRangeSlider from "@/components/user/price-range-slider";
import { FC, HTMLAttributes, useMemo, useRef, useState } from "react";
import { Sort } from "@/types/enum";
import { useSearchParams } from "react-router-dom";
import { ArrowUpDown } from "lucide-react";

interface FilterToolsProps extends HTMLAttributes<HTMLDivElement> {
  onSortSelection: (value: Sort) => void;
  onPriceRangeChange: (value: number[]) => void;
  onSaleFilterChange: (value: boolean) => void;
}

const FilterProductTools: FC<FilterToolsProps> = ({ ...props }) => {
  const [searchParams] = useSearchParams();
  const [selectComponentKey, setSelectComponentKey] = useState<number>(1);
  const minPrice = useRef(100000);
  const maxPrice = useRef(100000000);
  const priceStep = useRef(100000);

  const [sortValue, setSortValue] = useState<Sort | undefined>(() => {
    const sortByPrice = searchParams.get("sortByPrice") || undefined;
    const sortByName = searchParams.get("sortByName") || undefined;
    if (sortByPrice) {
      return sortByPrice === "ASC" ? Sort.ASC : Sort.DES;
    } else if (sortByName) {
      return sortByName === "ASC" ? Sort.ATOZ : Sort.ZTOA;
    }
    return undefined;
  });
  const [isSale, setIsSale] = useState(
    Boolean(searchParams.get("sale")) || false
  );
  const priceRangeValue = [
    Number(searchParams.get("minPrice")) || minPrice.current,
    Number(searchParams.get("maxPrice")) || maxPrice.current,
  ];
  const alphabetSortValue = useMemo(
    () =>
      sortValue === Sort.ATOZ || sortValue === Sort.ZTOA
        ? sortValue
        : undefined,
    [sortValue]
  );

  const handleSaleFilterChange = () => {
    setIsSale((prevValue) => !prevValue);
    props.onSaleFilterChange(!isSale);
  };

  const handleSortChange = (value: string) => {
    if (value !== sortValue) {
      setSortValue(value as Sort);
      props.onSortSelection(value as Sort);

      //reset the a->z and z->a dropdown selection if user choose sort by price
      if (value === Sort.ASC || value === Sort.DES) {
        setSelectComponentKey((prevValue) => (prevValue === 1 ? 2 : 1));
      }
    }
  };

  return (
    <div
      className={cn(
        "flex bg-slate-200 rounded-lg p-4 4xl_py-6 flex-col-reverse gap-4 lgg_flex-row",
        props.className
      )}
    >
      <div className="grid grid-cols-2 4xl_flex gap-3">
        <Button
          variant="dashed"
          value={Sort.ASC}
          onClick={(e) => handleSortChange(e.currentTarget.value)}
          className={cn(sortValue === Sort.ASC && "bg-slate-600 !text-white")}
        >
          Giá tăng dần
        </Button>
        <Button
          variant="dashed"
          value={Sort.DES}
          onClick={(e) => handleSortChange(e.currentTarget.value)}
          className={cn(sortValue === Sort.DES && "bg-slate-600 !text-white")}
        >
          Giá giảm dần
        </Button>
        <Button
          variant="dashed"
          className={cn(isSale && "bg-slate-600 !text-white")}
          onClick={handleSaleFilterChange}
        >
          Giảm giá
        </Button>
        <Select
          key={selectComponentKey}
          value={alphabetSortValue}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="focus_ring-0 focus_ring-offset-0">
            <SelectValue
              placeholder={
                <span className="flex gap-2 text-sm md_text-base">
                  <ArrowUpDown /> Theo tên
                </span>
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={Sort.ATOZ} className="text-sm md_text-base">
                {`Tên từ A->Z`}
              </SelectItem>
              <SelectItem
                value={Sort.ZTOA}
                className="text-sm md_text-base"
              >{`Tên từ Z->A`}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="text-sm md_text-md self-center pr-4 flex-1 flex justify-between items-center flex-row mt-2 lgg_mt-0 lgg_flex-col lg_flex-row gap-4 lg_gap-0 w-full">
        <Label className="font-extrabold text-nowrap">Khoảng giá: &nbsp;</Label>
        <PriceRangeSlider
          min={minPrice.current}
          max={maxPrice.current}
          step={priceStep.current}
          defaultValues={priceRangeValue}
          onValueChange={props.onPriceRangeChange}
        />
      </div>
    </div>
  );
};

export default FilterProductTools;
