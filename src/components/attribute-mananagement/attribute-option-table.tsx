import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { FC, HTMLAttributes, useMemo } from "react";
import { Attribute, AttributeOption } from "@/types/model";
import { cn } from "@/lib/utils";

const optionColsName: string[] = ["STT", "GIÁ TRỊ"];

interface AttributeOptionTableProps extends HTMLAttributes<HTMLDivElement> {
  attributes: Attribute[];
  selectedAttribute: Attribute | undefined;
  selectedAttributeOption: AttributeOption | undefined;
  setSelectedAttributeOption: (option: AttributeOption) => void;
}

const AttributeOptionTable: FC<AttributeOptionTableProps> = ({
  attributes,
  selectedAttribute,
  ...props
}) => {
  const attribute = useMemo<Attribute | undefined>(() => {
    return attributes.find((attr) => attr.typeID === selectedAttribute?.typeID);
  }, [attributes, selectedAttribute]);

  if (!attribute || attribute.attributeOptions.length === 0) {
    return (
      <Card className="rounded-xl shadow-lg !max-h-[40.8rem] flex-1">
        <CardContent className="p-4 h-full">
          <div className="flex flex-col items-center">
            <img width={400} src="/empty-box.svg" alt="emptyCart" />
            <span className="text-xl font-medium text-slate-500">
              Chưa có giá trị nào!
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-lg !max-h-[40.8rem] flex-1">
      <CardContent className="p-4 h-full">
        <ScrollArea className="relative h-[64vh]">
          <Table>
            <TableHeader className="z-10 border-b-secondary-foreground shadow-lg bg-white border-b-2 sticky top-0">
              <tr>
                {optionColsName.map((item, key) => {
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
              {attribute.attributeOptions.map((option, index) => (
                <TableRow
                  onClick={() => props.setSelectedAttributeOption(option)}
                  className={cn(
                    "cursor-pointer",
                    props.selectedAttributeOption?.optionID ===
                      option.optionID && "bg-theme-softer"
                  )}
                  key={index}
                >
                  <TableCell className="text-center text-base">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-center text-base">
                    {option.optionValue}
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

export default AttributeOptionTable;
