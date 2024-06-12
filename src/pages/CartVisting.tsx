import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect } from "react";
import log from "loglevel";
import { Button } from "@/components/ui/button";

log.setLevel("error");

const header = [
  "STT",
  "Ảnh",
  "Sản Phẩm",
  "Giá",
  "Số lượng",
  "Giảm Giá",
  "Thành Tiền",
];

const CartVisting = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const productRes = await axios.get<Product[]>(
        //   "http://localhost:4000/products"
        // );
        // setInvoiceProductData();
        //   productRes.data.slice(undefined, 5).map((...product) => {
        //     return {};
        //   })
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          // AxiosError-specific handling
          log.error("Axios error:", error.message);
          if (error.response) {
            log.error("Response data:", error.response.data);
            log.error("Response status:", error.response.status);
          }
        } else {
          // General error handling
          log.error("Unexpected error:", error);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-3 w-full">
      <section className="col-span-2 rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {header.map((title, index) => {
                return <TableHead key={index}>{title}</TableHead>;
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* {productData?.map((prod, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <image />
                  </TableCell>
                </TableRow>
              );
            })} */}
          </TableBody>
          <TableFooter>
            <Button>Xóa Hết Giỏ Hàng</Button>
          </TableFooter>
        </Table>
      </section>
      <section className="rounded-md"></section>
    </div>
  );
};

export { CartVisting };
