import Card4Product from "@/components/card4Product";
import CardTag from "@/components/ui/cardTag";
import { BsFillDeviceSsdFill, BsGpuCard } from "react-icons/bs";
import { GoCpu } from "react-icons/go";
import { PiFrameCornersLight } from "react-icons/pi";
import { TbFrame } from "react-icons/tb";
import { useEffect, useState } from "react";
import Item from "@/declare";
import axios from "axios";

const Products = () => {
  // const [loading, setLoading] = useState(true);

  const [data, setData] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await axios.get("http://localhost:4000/items");
        console.log(items);
        setData(items.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          // AxiosError-specific handling
          console.error("Axios error:", error.message);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
          }
        } else {
          // General error handling
          console.error("Unexpected error:", error);
        }
      }
    };

    fetchData();
  }, []);
  // if(loading){
  //   return (
  //   );
  // }

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
          {data.map((item) => (
            <Card4Product item={item}>
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
