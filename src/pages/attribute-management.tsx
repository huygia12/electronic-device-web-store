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
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { FC, useState } from "react";
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
import { toast } from "sonner";
import axios, { HttpStatusCode } from "axios";
import { Separator } from "@/components/ui/separator";
import { arrayInReverse } from "@/utils/helpers";
import { AttributeOption, Attribute } from "@/types/api";
import { AttributeDialog, OptionDialog } from "@/components/admin";
import { attributeApis } from "@/services/apis";

const typeColsName: string[] = ["STT", "THUỘC TÍNH"];

const optionColsName: string[] = ["STT", "GIÁ TRỊ"];

const AttributeManagement: FC = () => {
  const attributeData = useRouteLoaderData(
    "attribute_management"
  ) as Attribute[];
  const [attributes, setAttributes] = useState<Attribute[]>(attributeData);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute>();
  const [selectedAttributeOption, setSelectedAttributeOption] =
    useState<AttributeOption>();
  const [searchingInput, setSearchingInput] = useState("");

  const handleAddAttributeType = async (name: string) => {
    const processedName: string = name.trim();
    try {
      await attributeApis.addAttributeType(processedName);
      await resetAttributesAfterAttributeProcessing();
      toast.success("Thêm thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          toast.error("Thêm thất bại: thể loại này đã tồn tại!");
        } else {
          toast.error("Thêm thất bại!");
        }
        console.error(`Response data: ${error.response?.data}`);
        console.error(`Response status: ${error.response?.status})`);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleUpdateAttributeType = async (name: string) => {
    if (!selectedAttribute) return;
    const processedName: string = name.trim();
    try {
      await attributeApis.updateAttributeType(
        selectedAttribute.typeID,
        processedName
      );
      await resetAttributesAfterAttributeProcessing();
      toast.success("Thay đổi thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          toast.error("Thay đổi thất bại: thể loại này đã tồn tại!");
        } else {
          toast.error("Thay đổi thất bại!");
        }
        if (error.response) {
          console.error(`Response data: ${error.response.data}`);
          console.error(`Response status: ${error.response.status})`);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleDeleteAttributeType = async () => {
    if (!selectedAttribute) return;
    try {
      await attributeApis.deleteAttribute(selectedAttribute.typeID);
      await resetAttributesAfterAttributeProcessing();
      toast.success("Thay đổi thành công!");
    } catch (error) {
      toast.error("Thay đổi thất bại!");
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(`Response data: ${error.response.data}`);
          console.error(`Response status: ${error.response.status})`);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleAddAttributeOption = async (name: string) => {
    if (!selectedAttribute) return;
    const processedName: string = name.trim();
    try {
      await attributeApis.addAttributeOption(
        selectedAttribute.typeID,
        processedName
      );
      await resetAttributesAfterOptionProcessing();
      toast.success("Thêm thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          toast.error("Thêm thất bại: giá trị này đã tồn tại!");
        } else {
          toast.error("Thêm thất bại!");
        }
        console.error(`Response data: ${error.response?.data}`);
        console.error(`Response status: ${error.response?.status})`);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleUpdateAttributeOption = async (name: string) => {
    if (!selectedAttributeOption || !selectedAttribute) return;
    const processedName: string = name.trim();
    try {
      await attributeApis.updateAttributeOption(
        selectedAttributeOption.optionID,
        selectedAttribute.typeID,
        processedName
      );
      await resetAttributesAfterOptionProcessing();
      toast.success("Thay đổi thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          toast.error("Thay đổi thất bại: giá trị này đã tồn tại!");
        } else {
          toast.error("Thay đổi thất bại!");
        }
        if (error.response) {
          console.error(`Response data: ${error.response.data}`);
          console.error(`Response status: ${error.response.status})`);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleDeleteAttributeOption = async () => {
    if (!selectedAttributeOption || !selectedAttribute) return;
    try {
      await attributeApis.deleteAttributeOption(
        selectedAttributeOption.typeID,
        selectedAttributeOption.optionID
      );
      await resetAttributesAfterOptionProcessing();
      toast.success("Thay đổi thành công!");
    } catch (error) {
      toast.error("Thay đổi thất bại!");
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(`Response data: ${error.response.data}`);
          console.error(`Response status: ${error.response.status})`);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const resetAttributesAfterOptionProcessing = async () => {
    const fetchedAttributes: Attribute[] = await attributeApis.getAttributes();
    setAttributes(fetchedAttributes);
    setSelectedAttribute(
      fetchedAttributes.find(
        (attr) => attr.typeID === selectedAttribute?.typeID
      )
    );
    setSelectedAttributeOption(undefined);
  };

  const resetAttributesAfterAttributeProcessing = async () => {
    const fetchedAttributes: Attribute[] = await attributeApis.getAttributes();
    setAttributes(fetchedAttributes);
    setSelectedAttribute(undefined);
    setSelectedAttributeOption(undefined);
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
          onChange={(e) => {
            setSearchingInput(e.target.value);
            setSelectedAttribute(undefined);
            setSelectedAttributeOption(undefined);
          }}
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
            {selectedAttribute ? (
              <>
                <AttributeDialog
                  attribute={selectedAttribute}
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
                        onClick={() => handleDeleteAttributeType()}
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
            {attributes.length !== 0 ? (
              <ScrollArea className="relative h-[64vh]">
                <Table>
                  <TableHeader className="z-10 border-b-secondary-foreground shadow-lg bg-white border-b-2 sticky top-0">
                    <tr>
                      {typeColsName.map((item, key) => {
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
                    {arrayInReverse(attributes)
                      .filter((attr) =>
                        attr.typeValue
                          .toLowerCase()
                          .includes(searchingInput.toLowerCase())
                      )
                      .map((attr, index) => (
                        <TableRow
                          onClick={() => {
                            setSelectedAttribute(attr);
                            setSelectedAttributeOption(undefined);
                          }}
                          key={index}
                          className={
                            selectedAttribute &&
                            attr.typeID === selectedAttribute.typeID
                              ? "bg-theme-softer"
                              : ""
                          }
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
            ) : (
              <div className="flex flex-col items-center">
                <img width={400} src="/empty-box.svg" alt="emptyCart" />
                <span className="text-xl font-medium text-slate-500 mb-10">
                  Chưa có thuộc tính nào!
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/** ATTRIBUTE OPTION */}
      <div className="col-span-2 flex gap-4">
        {/** ATTRIBUTE OPTION TABLE */}
        <Card className="rounded-xl shadow-lg !max-h-[40.8rem] flex-1">
          <CardContent className="p-4 h-full">
            {selectedAttribute &&
            selectedAttribute.attributeOptions.length !== 0 ? (
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
                    {arrayInReverse(selectedAttribute.attributeOptions).map(
                      (option, index) => (
                        <TableRow
                          onClick={() => setSelectedAttributeOption(option)}
                          className={
                            selectedAttributeOption &&
                            option.optionID === selectedAttributeOption.optionID
                              ? "bg-theme-softer"
                              : ""
                          }
                          key={index}
                        >
                          <TableCell className="text-center text-base">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center  text-base">
                            {option.optionValue}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                    <tr>
                      <td>
                        <Separator />
                      </td>
                    </tr>
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center">
                <img width={400} src="/empty-box.svg" alt="emptyCart" />
                <span className="text-xl font-medium text-slate-500">
                  Chưa có giá trị nào!
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/** ATTRIBUTE OPTION'S TOOLS */}
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-4 space-y-4 contain-content">
            {selectedAttribute ? (
              <OptionDialog
                formTitle="Thêm giá trị mới"
                handleDialogAcceptEvent={handleAddAttributeOption}
              >
                <Button className="" variant="positive">
                  <Plus />
                </Button>
              </OptionDialog>
            ) : (
              <Plus className="mx-4 !mb-7v !mt-3" />
            )}
            {selectedAttributeOption && selectedAttribute?.attributeOptions ? (
              <>
                <OptionDialog
                  option={selectedAttributeOption}
                  formTitle="Sửa tên giá trị"
                  handleDialogAcceptEvent={handleUpdateAttributeOption}
                >
                  <Button variant="neutral">
                    <SquarePen />
                  </Button>
                </OptionDialog>
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
                        onClick={() => handleDeleteAttributeOption()}
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
