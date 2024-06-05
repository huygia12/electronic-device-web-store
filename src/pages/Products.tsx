import Card4Product from "@/components/card4Product";
import CardTag from "@/components/ui/cardTag";
import { BsFillDeviceSsdFill, BsGpuCard } from "react-icons/bs";
import { GoCpu } from "react-icons/go";
import { PiFrameCornersLight } from "react-icons/pi";
import { TbFrame } from "react-icons/tb";
import { useEffect, useState } from "react";
import { ProductAttributes } from "@/declare";
import axios from "axios";
import log from "loglevel";

log.setLevel("error");

const Products = () => {
  const [data, setData] = useState<ProductAttributes[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await axios.get("http://localhost:4000/items");
        setData(items.data);
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
    <main className="grid grid-cols-4 gap-8">
      <div className="bg-red-500"></div>
      <div className="col-span-3">
        <div className="mb-[2rem]">
          <h1 className="text-[2rem] font-semibold mb-[0.5rem]">
            Tất cả sản phẩm
          </h1>
          <hr className="border-dashed border-[0.1rem] border-secondary-foreground" />
        </div>
        <div className="col-span-3 grid grid-cols-4 gap-4">
          {data.map((item, index) => (
            <Card4Product key={index} item={item}>
              <CardTag content="1TB">
                <BsFillDeviceSsdFill />
              </CardTag>
              <CardTag content="Intel Arc">
                <BsGpuCard />
              </CardTag>
              <CardTag content="Ultra 9 185H">
                <GoCpu />
              </CardTag>
              <CardTag content="14 inch 3K OLED">
                <PiFrameCornersLight />
              </CardTag>
              <CardTag content="120Hz">
                <TbFrame />
              </CardTag>
            </Card4Product>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Products;
