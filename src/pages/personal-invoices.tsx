import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "@/types/api";
import { FC, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Badge from "@/components/ui/badge";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { afterDiscount } from "@/utils/product";
import { invoiceListHeader, productListHeader } from "@/utils/constants";

const PersonalInvoices: FC = () => {
  // const invoiceData = useRouteLoaderData("my_invoices") as Invoice[];
  const [invoices] = useState<Invoice[]>();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>();

  const handleInvoiceSelection = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  return (
    <>
      <h1 className="text-[1.8rem] font-semibold text-center mb-8">
        Đơn Hàng Của Bạn
      </h1>
      <Card className="max-w-[70rem] rounded-xl shadow-lg mt-8 mb-4 mx-auto">
        <CardContent className="flex flex-col px-6 py-4">
          {invoices && invoices.length !== 0 ? (
            <ScrollArea className="relative h-[60vh]">
              <Table>
                <TableHeader className="z-10 border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
                  <tr>
                    {invoiceListHeader.map((item, key) => {
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
                  {invoices.map((invoice, index) => (
                    <TableRow
                      key={index}
                      onSelect={() => handleInvoiceSelection(invoice)}
                    >
                      <TableCell className="text-center  text-base">
                        {invoice.invoiceID}
                      </TableCell>
                      <TableCell className="text-center text-base">
                        {`${invoice.createdAt}`}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-blue-500 text-white hover_bg-blue-500">
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center justify-center space-x-2">
                        {selectedInvoice && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="neutral">Xem Chi Tiết</Button>
                            </DialogTrigger>
                            <DialogContent className="min-w-max">
                              <DialogHeader>
                                <DialogTitle className="text-[1.4rem]">
                                  CHI TIẾT ĐƠN HÀNG
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-2">
                                <div className="mt-6">
                                  <span className="font-semibold">
                                    Mã Đơn Hàng: &nbsp;
                                  </span>
                                  <span>{selectedInvoice.invoiceID}</span>
                                </div>
                                <div>
                                  <span className="font-semibold">
                                    Ngày Đặt Hàng: &nbsp;
                                  </span>
                                  <span>{`${selectedInvoice.createdAt}`}</span>
                                </div>
                                <div>
                                  <span className="font-semibold">
                                    Trạng Thái: &nbsp;
                                  </span>
                                  <span>{selectedInvoice.status}</span>
                                </div>
                                <div>
                                  <span className="font-semibold">
                                    Tên Khách Hàng: &nbsp;
                                  </span>
                                  <span>{selectedInvoice.userName}</span>
                                </div>
                                <div>
                                  <span className="font-semibold">
                                    Số Điện Thoại: &nbsp;
                                  </span>
                                  <span>{selectedInvoice.phoneNumber}</span>
                                </div>
                                <div>
                                  <span className="font-semibold">
                                    Địa chỉ: &nbsp;
                                  </span>
                                  <span>{`${selectedInvoice.ward}, ${selectedInvoice.city}, ${selectedInvoice.province},`}</span>
                                </div>
                                <div>
                                  <span className="font-semibold">
                                    Chi Tiết: &nbsp;
                                  </span>
                                  <span>{selectedInvoice.detailAddress}</span>
                                </div>
                                <Separator />
                              </div>

                              <ScrollArea className="relative h-[20rem] rounded-md mt-10 border-slate-200 border-b-2">
                                <Table>
                                  <TableHeader className="z-10 sticky top-0 border-b-2 bg-white shadow-lg">
                                    <tr>
                                      {productListHeader.map((title, index) => {
                                        return (
                                          <TableHead
                                            className=" text-center text-black font-extrabold text-[1rem]"
                                            key={index}
                                          >
                                            {title}
                                          </TableHead>
                                        );
                                      })}
                                    </tr>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedInvoice.products.map(
                                      (prod, index) => {
                                        return (
                                          <TableRow key={index}>
                                            <TableCell className="text-center text-base">
                                              {index + 1}
                                            </TableCell>
                                            <TableCell className="text-center text-base max-w-[15rem] truncate">
                                              {prod.productName}
                                              <br />
                                              {`${prod.storageName} | ${prod.colorName}`}
                                            </TableCell>
                                            <TableCell className="text-center text-base">
                                              {prod.price.toLocaleString() +
                                                "đ"}
                                            </TableCell>
                                            <TableCell className="text-center text-base">
                                              {prod.discount + "%"}
                                            </TableCell>
                                            <TableCell className="text-center text-base">
                                              {afterDiscount(
                                                prod.price,
                                                prod.discount
                                              ).toLocaleString() + "đ"}
                                            </TableCell>
                                            <TableCell className="text-center text-base">
                                              {prod.quantity}
                                            </TableCell>
                                          </TableRow>
                                        );
                                      }
                                    )}
                                  </TableBody>
                                </Table>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                        )}
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
              <Scrollbar orientation="vertical" />
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center">
              <img width={500} src="/empty-box.svg" alt="emptyCart" />
              <span className="text-xl font-medium text-slate-500 mb-10">
                Bạn chưa có đơn hàng nào!
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default PersonalInvoices;
