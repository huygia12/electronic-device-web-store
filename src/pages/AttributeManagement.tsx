import AttributeDialog from "@/components/attributeDialog";
import OptionDialog from "@/components/optionDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AttributeType } from "@/declare";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";

const attrTypeColsName: string[] = ["STT", "THỂ LOẠI", "ID", "THAO TÁC"];

const attrOptionColsName: string[] = ["STT", "TÊN GIÁ TRỊ", "ID", "THAO TÁC"];

const AttributeManagement = () => {
  const attributesData = useRouteLoaderData(
    "attribute_management"
  ) as AttributeType[];
  const [selectedAttr, setSelectedAttr] = useState<AttributeType>(
    attributesData[0]
  );

  return (
    <section className=" grid grid-cols-5 gap-4">
      <Card className="rounded-2xl shadow-lg mt-8 col-span-5">
        <CardContent className="flex justify-between p-6">
          <AttributeDialog formTitle="Thêm thể loại mới">
            <Button variant="positive" className="text-xl">
              Thêm thể loại mới
              <Plus />
            </Button>
          </AttributeDialog>
          <div className="relative my-auto h-[2.5rem]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm..."
              className="h-full text-xl w-full rounded-lg bg-background pl-8 md_w-[200px] lg_w-[336px]"
            />
          </div>
        </CardContent>
      </Card>

      {/** ATTRIBUTE TYPE TABLE */}
      <Card className="rounded-2xl shadow-lg col-span-3">
        <CardHeader className="py-5 px-10">
          <CardTitle className="text-8">Danh sách các thể loại</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <ScrollArea className="relative h-[64vh]">
            <Table>
              <TableHeader className="z-10 border-b-secondary-foreground shadow-lg bg-white border-b-2 sticky top-0">
                <tr>
                  {attrTypeColsName.map((item, key) => {
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
                {attributesData.map((attr, index) => (
                  <TableRow
                    onClick={() => setSelectedAttr(attr)}
                    key={index}
                    className={
                      attr.typeID === selectedAttr.typeID
                        ? "bg-theme-softer"
                        : ""
                    }
                  >
                    <TableCell className="text-center text-base">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {attr.typeName}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {attr.typeID}
                    </TableCell>
                    <TableCell className="flex items-center justify-center space-x-2">
                      <OptionDialog formTitle="Thêm giá trị">
                        <Button variant="positive">
                          <Plus />
                        </Button>
                      </OptionDialog>
                      <AttributeDialog
                        attribute={attr}
                        formTitle="Sửa thể loại mới"
                      >
                        <Button variant="neutral">
                          <SquarePen />
                        </Button>
                      </AttributeDialog>
                      <Button variant="negative">
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/** ATTRIBUTE OPTION TABLE */}
      <Card className="rounded-2xl shadow-lg col-span-2 !max-h-[40.8rem]">
        <CardContent className="py-16">
          <ScrollArea className="relative h-[64vh]">
            <Table>
              <TableHeader className="z-10 border-b-secondary-foreground shadow-lg bg-white border-b-2 sticky top-0">
                <tr>
                  {attrOptionColsName.map((item, key) => {
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
                {selectedAttr.values.map((option, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center text-base">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-center  text-base">
                      {option.optionValue}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {option.optionID}
                    </TableCell>
                    <TableCell
                      colSpan={3}
                      className="flex items-center justify-center space-x-2"
                    >
                      <OptionDialog option={option} formTitle="Sửa giá trị">
                        <Button variant="neutral">
                          <SquarePen />
                        </Button>
                      </OptionDialog>
                      <Button variant="negative">
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  );
};

export default AttributeManagement;
