import { FC, HTMLAttributes, useMemo, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Attribute } from "@/types/model";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AttributeFilterProps extends HTMLAttributes<HTMLDivElement> {
  params: URLSearchParams;
  attributes: Attribute[] | undefined;
  onReset: () => void;
  onOptionSelected: (optionID: string, attribute: Attribute) => void;
}

const AttributeFilter: FC<AttributeFilterProps> = ({ ...props }) => {
  const [selectComponentKey, setSelectComponentKey] = useState<number>(1);
  const refreshButtonVisibility = useMemo(
    () => props.attributes && props.attributes.length > 0,
    [props.attributes]
  );
  const optionIDs = useMemo<string[]>(() => {
    const currentFilter = props.params.get("optionIDs") || "";
    return currentFilter.split(",").filter(Boolean);
  }, [props.params]);

  const handleClearEvent = () => {
    props.onReset();
    setSelectComponentKey(selectComponentKey === 1 ? 2 : 1);
  };

  return (
    <div className={cn("flex flex-col", props.className)}>
      <h2 className="w-full text-lg sm_text-[1.4rem] font-extrabold pb-4">
        LỌC SẢN PHẨM
      </h2>
      <ul key={selectComponentKey} className="">
        {props.attributes?.map((attr, parentIndex) => {
          return (
            attr.attributeOptions.length > 0 && (
              <li key={parentIndex} className="space-y-3 mb-8">
                <h5 className="text-slate-700 font-extrabold text-sm md_text-base">
                  {attr.typeValue}
                </h5>
                <Separator className="border-1 border-slate-400" />
                <RadioGroup className="pl-2 md_pl-4 space-y-2">
                  {attr.attributeOptions?.map((option, childIndex) => {
                    return (
                      <div
                        key={childIndex}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <RadioGroupItem
                          checked={optionIDs.includes(option.optionID)}
                          onClick={() =>
                            props.onOptionSelected(option.optionID, attr)
                          }
                          value={option.optionID}
                          id={`${parentIndex}${childIndex}`}
                        />
                        <Label
                          htmlFor={`${parentIndex}${childIndex}`}
                          className="text-slate-600 !my-0 cursor-pointer text-xs md_text-base"
                        >
                          {option.optionValue}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </li>
            )
          );
        })}
      </ul>
      {refreshButtonVisibility && (
        <Button
          variant={"destructive"}
          onClick={handleClearEvent}
          className="ml-auto mr-4 w-20"
        >
          Làm mới
        </Button>
      )}
    </div>
  );
};

export default AttributeFilter;
