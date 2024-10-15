import { FC, HTMLAttributes, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Attribute, AttributeOption } from "@/types/model";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

interface AttributeFilterProps extends HTMLAttributes<HTMLDivElement> {
  attributes: Attribute[] | undefined;
  handleClearEvent: () => void;
  handleSelectOption: (option: AttributeOption) => void;
}

const AttributeFilter: FC<AttributeFilterProps> = ({ ...props }) => {
  const [selectComponentKey, setSelectComponentKey] = useState<number>(1);

  const handleClearEvent = () => {
    props.handleClearEvent();
    setSelectComponentKey(selectComponentKey === 1 ? 2 : 1);
  };

  return (
    <div className={cn("flex flex-col", props.className)}>
      <h2 className="w-full text-[1.4rem] font-extrabold pt-2 pb-4">
        LỌC SẢN PHẨM
      </h2>
      <ul key={selectComponentKey} className="px-4">
        {props.attributes?.map((attr, parentIndex) => {
          return (
            <li key={parentIndex} className="space-y-3 mb-8">
              <h5 className="text-slate-700 font-extrabold">
                {attr.typeValue}
              </h5>
              <Separator className="border-1 border-slate-400" />
              <RadioGroup className="pl-4 space-y-2">
                {attr.attributeOptions?.map((option, childIndex) => {
                  return (
                    <div
                      key={childIndex}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        onClick={() => props.handleSelectOption(option)}
                        value={option.optionID}
                        id={`${parentIndex}${childIndex}`}
                      />
                      <Label
                        htmlFor={`${parentIndex}${childIndex}`}
                        className="text-slate-600 !my-0"
                      >
                        {option.optionValue}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </li>
          );
        })}
      </ul>
      {props.attributes && props.attributes.length > 0 && (
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
