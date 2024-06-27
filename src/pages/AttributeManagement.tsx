import AttributeDialog from "@/components/attributeDialog";
import OptionDialog from "@/components/optionDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/utils/constants";
import { axiosInstance, reqConfig } from "@/utils/axiosConfig";
import { useCurrAccount } from "@/utils/customHook";
import loader from "@/api/preApiLoader.ts";
import { toast } from "sonner";
import log from "loglevel";
import axios, { HttpStatusCode } from "axios";
import { Separator } from "@/components/ui/separator";

const attrTypeColsName: string[] = ["STT", "ID", "THUỘC TÍNH"];

const attrOptionColsName: string[] = ["STT", "ID", "GIÁ TRỊ"];

const AttributeManagement = () => {
  const { currAccount } = useCurrAccount();
  const attributeTypesLoader = useRouteLoaderData(
    "attribute_management"
  ) as AttributeType[];
  const [attributeTypes, setAttributeTypes] = useState<
    AttributeType[] | undefined
  >(attributeTypesLoader);
  const [selectedAttr, setSelectedAttr] = useState<AttributeType>(
    attributeTypesLoader[0]
  );
  const [setSearchingInput] = useState("");

  const handleAddAttributeType = async (name: string) => {
    const processedName: string = name.trim();
    try {
      await axiosInstance.post(
        "/attributes",
        {
          name: processedName,
        },
        {
          headers: {
            "User-id": currAccount?.id,
          },
          ...reqConfig,
        }
      );

      const attributes: AttributeType[] | undefined =
        await loader.getAttributes();
      setAttributeTypes(attributes);
      toast.success("Thêm thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          toast.error("Thêm thất bại: thể loại này đã tồn tại!");
        } else {
          toast.error("Thêm thất bại!");
        }
        log.error(`Response data: ${error.response?.data}`);
        log.error(`Response status: ${error.response?.status})`);
      } else {
        log.error("Unexpected error:", error);
      }
    }
  };

  const handleUpdateAttributeType = async (name: string) => {
    const processedName: string = name.trim();
    try {
      await axiosInstance.patch(
        `/attributes/${selectedAttr?.typeID}`,
        {
          name: processedName,
        },
        {
          headers: {
            "User-id": currAccount?.id,
          },
          ...reqConfig,
        }
      );

      const attributes: AttributeType[] | undefined =
        await loader.getAttributes();
      setAttributeTypes(attributes);
      toast.success("Thay đổi thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          toast.error("Thay đổi thất bại: thể loại này đã tồn tại!");
        } else {
          toast.error("Thay đổi thất bại!");
        }
        if (error.response) {
          log.error(`Response data: ${error.response.data}`);
          log.error(`Response status: ${error.response.status})`);
        }
      } else {
        log.error("Unexpected error:", error);
      }
    }
  };

  const handleDeleteAttributes = async () => {
    try {
      await axiosInstance.delete(`/attributes/${selectedAttr?.typeID}`, {
        headers: {
          "User-id": currAccount?.id,
        },
        ...reqConfig,
      });
      const attributes: AttributeType[] | undefined =
        await loader.getAttributes();
      setAttributeTypes(attributes);
      toast.success("Thay đổi thành công!");
    } catch (error) {
      toast.error("Thay đổi thất bại!");
      if (axios.isAxiosError(error)) {
        if (error.response) {
          log.error(`Response data: ${error.response.data}`);
          log.error(`Response status: ${error.response.status})`);
        }
      } else {
        log.error("Unexpected error:", error);
      }
    }
  };

  return (
    <section className=" grid grid-cols-5 gap-4">
      {/** SEARCH BOX */}
      <div className="relative h-[3rem] mt-8 col-span-5">
        <Search className="absolute left-4 top-3 h-6 w-6 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Tìm kiếm..."
          className="h-full text-lg w-full rounded-xl bg-background pl-14 focus-visible_!ring-0 focus-visible_!ring-offset-0"
          onChange={(e) => setSearchingInput(e.target.value)}
        />
      </div>

      {/** ATTRIBUTE TYPE */}
      <div className="col-span-3 flex gap-4">
        {/** ATTRIBUTE TYPE'S TOOLS */}
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-4 space-y-4 contain-content">
            <AttributeDialog
              formTitle="Thêm thuộc tính mới"
              handleDialogAcceptEvent={handleAddAttributeType}
            >
              <Button className="" variant="positive">
                <Plus />
              </Button>
            </AttributeDialog>
            {selectedAttr ? (
              <>
                <AttributeDialog
                  attribute={selectedAttr}
                  formTitle="Sửa tên thuộc tính"
                  handleDialogAcceptEvent={handleUpdateAttributeType}
                >
                  <Button variant="neutral">
                    <SquarePen />
                  </Button>
                </AttributeDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="negative">
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bạn muốn xóa?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Hành động này sẽ trực tiếp xóa thuộc tính của sản phẩm
                        và không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction
                        onClick={() => handleDeleteAttributes()}
                        className={buttonVariants({
                          variant: "negative",
                        })}
                      >
                        Xóa
                      </AlertDialogAction>
                      <AlertDialogCancel className="mt-0">
                        Hủy
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <SquarePen className="mx-4 !mt-6" />
                <Trash2 className="mx-4 !mt-6" />
              </>
            )}
          </CardContent>
        </Card>

        {/** ATTRIBUTE TYPE TABLE */}
        <Card className="rounded-xl shadow-lg flex-1">
          <CardContent className="p-4">
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
                  {attributeTypes?.map((attr, index) => (
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
                        {attr.typeID}
                      </TableCell>
                      <TableCell className="text-center text-base">
                        {attr.typeName}
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
      </div>

      {/** ATTRIBUTE OPTION */}
      <div className="col-span-2 flex gap-4">
        {/** ATTRIBUTE OPTION TABLE */}
        <Card className="rounded-xl shadow-lg !max-h-[40.8rem] flex-1">
          <CardContent className="p-4">
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
                  {selectedAttr.options.map((option, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center text-base">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-center text-base">
                        {option.optionID}
                      </TableCell>
                      <TableCell className="text-center  text-base">
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
        {/** ATTRIBUTE OPTION'S TOOLS */}
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-4 space-y-4 contain-content">
            <OptionDialog
              formTitle="Thêm giá trị mới"
              handleDialogAcceptEvent={handleAddAttributeType}
            >
              <Button className="" variant="positive">
                <Plus />
              </Button>
            </OptionDialog>
            {selectedAttr ? (
              <>
                <AttributeDialog
                  attribute={selectedAttr}
                  formTitle="Sửa tên giá trị"
                  handleDialogAcceptEvent={handleUpdateAttributeType}
                >
                  <Button variant="neutral">
                    <SquarePen />
                  </Button>
                </AttributeDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="negative">
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bạn muốn xóa?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Hành động này sẽ trực tiếp xóa giá trị của thuộc tính và
                        không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction
                        onClick={() => handleDeleteAttributes()}
                        className={buttonVariants({
                          variant: "negative",
                        })}
                      >
                        Xóa
                      </AlertDialogAction>
                      <AlertDialogCancel className="mt-0">
                        Hủy
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <SquarePen className="mx-4 !mt-6" />
                <Trash2 className="mx-4 !mt-6" />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AttributeManagement;
