import AttributeDialog from "@/components/attributeDialog";
import { AttributeOptionDialog } from "@/components/attributeOptionDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { Eye, Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { useRouteLoaderData } from "react-router-dom";

const colName: string[] = ["STT", "THỂ LOẠI", "ID", "SỐ GIÁ TRỊ", "THAO TÁC"];

const AttributeManagement = () => {
  const attributesData = useRouteLoaderData(
    "attribute_management"
  ) as AttributeType[];

  return (
    <>
      {/** Add and search */}
      <Card className="rounded-2xl shadow-lg my-8">
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

      {/** Table */}
      <Card className="rounded-2xl shadow-lg mb-8">
        <CardHeader className="py-5 px-10">
          <CardTitle className="text-8">Danh sách các thể loại</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col px-6 pb-4">
          <ScrollArea className="relative h-[58vh]">
            <Table>
              <TableHeader className="z-10 border-b-secondary-foreground shadow-lg bg-white border-b-2 sticky top-0">
                <tr>
                  {colName.map((item, key) => {
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
                  <TableRow key={index}>
                    <TableCell className="text-center text-base">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {attr.typeName}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {attr.typeID}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {attr.values.length}
                    </TableCell>
                    <TableCell className="flex items-center justify-center space-x-2">
                      <AttributeOptionDialog
                        attribute={attr}
                        formTitle="Danh sách giá trị"
                      >
                        <Button variant="neutral">
                          <Eye />
                        </Button>
                      </AttributeOptionDialog>
                      <AttributeDialog
                        formTitle="Thêm thể loại mới"
                        attribute={attr}
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

      {/** Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default AttributeManagement;
