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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductAttribute } from "@/declare";
import { Eye, Plus, Search, SquarePen, Trash2 } from "lucide-react";

const colName: string[] = ["STT", "THỂ LOẠI", "ID", "SỐ GIÁ TRỊ", "THAO TÁC"];

const attributes: ProductAttribute[] = [
  {
    id: "11",
    name: "RAM",
    values: [
      {
        id: "123",
        name: "128GB",
      },
      {
        id: "121",
        name: "32GB",
      },
      {
        id: "122",
        name: "256GB",
      },
      {
        id: "120",
        name: "64GB",
      },
    ],
  },
  {
    id: "12",
    name: "CARD đồ họa",
    values: [
      {
        id: "123",
        name: "AMD Radeon Series",
      },
      {
        id: "124",
        name: "Nvidia GeForce Series",
      },
    ],
  },
  {
    id: "13",
    name: "Ổ cứng",
    values: [
      {
        id: "123",
        name: "SSD 1TB",
      },
      {
        id: "124",
        name: "SSD 512GB",
      },
      {
        id: "125",
        name: "SSD 256GB",
      },
      {
        id: "126",
        name: "SSD 128GB",
      },
    ],
  },
  {
    id: "14",
    name: "Nhu cầu",
    values: [
      {
        id: "123",
        name: "Gaming - Đồ họa",
      },
      {
        id: "124",
        name: "Sinh viên - Văn phòng",
      },
      {
        id: "125",
        name: "Mỏng nhẹ",
      },
      {
        id: "126",
        name: "Doanh nhân",
      },
      {
        id: "127",
        name: "AI",
      },
    ],
  },
  {
    id: "15",
    name: "Màn Hình",
    values: [
      {
        id: "123",
        name: "13 inch",
      },
      {
        id: "124",
        name: "14 inch",
      },
      {
        id: "125",
        name: "15inch",
      },
    ],
  },
  {
    id: "16",
    name: "CPU",
    values: [
      {
        id: "123",
        name: "Intel Celeron",
      },
      {
        id: "124",
        name: "Intel Pentium",
      },
      {
        id: "125",
        name: "Intel core i3",
      },
      {
        id: "126",
        name: "Intel core i5",
      },
      {
        id: "127",
        name: "Intel core i7",
      },
      {
        id: "128",
        name: "Intel core Ultra",
      },
      {
        id: "129",
        name: "AMD Ryzen 3",
      },
      {
        id: "130",
        name: "AMD Ryzen 5",
      },
      {
        id: "131",
        name: "AMD Ryzen 7",
      },
    ],
  },
  {
    id: "16",
    name: "Camera",
    values: [
      {
        id: "123",
        name: "Quay phim slow motion",
      },
      {
        id: "124",
        name: "AI camera",
      },
      {
        id: "125",
        name: "Hiệu ứng làm đẹp",
      },
      {
        id: "126",
        name: "Zoom quang học",
      },
    ],
  },
  {
    id: "17",
    name: "Màn hình",
    values: [
      {
        id: "123",
        name: "Dưới 5 inch",
      },
      {
        id: "124",
        name: "Trên 6 inch",
      },
      {
        id: "125",
        name: "Màn hình gập",
      },
    ],
  },
  {
    id: "18",
    name: "Tính năng đặc biệt",
    values: [
      {
        id: "123",
        name: "A.I phone",
      },
      {
        id: "124",
        name: "Bảo mật vân tay",
      },
      {
        id: "125",
        name: "Nhận diện khuôn mặt",
      },
      {
        id: "126",
        name: "Chống nước & bụi",
      },
      {
        id: "127",
        name: "Hỗ trọ 5G",
      },
    ],
  },
  {
    id: "19",
    name: "Hiệu năng và pin",
    values: [],
  },
];

const AttributeManagement = () => {
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
          <div className="overflow-auto relative h-[58vh]">
            <Table>
              <TableHeader className="border-b-secondary-foreground shadow-lg bg-white border-b-2 sticky top-0">
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
                {attributes.map((attr, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center text-base">
                      {index}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {attr.name}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {attr.id}
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
          </div>
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
