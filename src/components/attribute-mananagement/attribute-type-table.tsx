import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Attribute } from "@/types/model";
import { FC, HTMLAttributes } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const columnHeaders: string[] = ["STT", "THUỘC TÍNH"];

interface AttributeTypeTableProps extends HTMLAttributes<HTMLDivElement> {
  attributes: Attribute[];
  selectedAttribute: Attribute | undefined;
  handleSelectAttribute: (attribute: Attribute) => void;
}

const AttributeTypeTable: FC<AttributeTypeTableProps> = ({ ...props }) => {
  if (props.attributes.length == 0) {
    <Card className={cn("rounded-xl shadow-lg", props.className)}>
      <CardContent className="p-4">
        <div className="flex flex-col items-center">
          <img width={400} src="/empty-box.svg" alt="emptyCart" />
          <span className="text-xl font-medium text-slate-500 mb-10">
            Chưa có thuộc tính nào!
          </span>
        </div>
      </CardContent>
    </Card>;
  }

  return (
    <Card className={cn("rounded-xl shadow-lg", props.className)}>
      <CardContent className="p-4">
        <ScrollArea className="relative h-[64vh]">
          <Table>
            <TableHeader className="z-10 border-b-secondary-foreground shadow-lg bg-white border-b-2 sticky top-0">
              <tr>
                {columnHeaders.map((item, key) => {
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
              {props.attributes.map((attr, index) => (
                <TableRow
                  onClick={() => props.handleSelectAttribute(attr)}
                  key={index}
                  className={cn(
                    "cursor-pointer",
                    props.selectedAttribute?.typeID === attr.typeID &&
                      "bg-theme-softer"
                  )}
                >
                  <TableCell className="text-center text-base">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-center text-base">
                    {attr.typeValue}
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

export default AttributeTypeTable;
