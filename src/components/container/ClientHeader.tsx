import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FiShoppingBag } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import CounterLabel from "@/components/ui/counterLabel";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import CustomAvt from "../ui/customAvt";

const navComponents: { title: string; path: string }[] = [
  { title: "Trang chủ", path: "/" },
  { title: "Giới thiệu", path: "/intro" },
  { title: "Tin tức", path: "/announcement" },
  { title: "Liên hệ", path: "/intro" },
];

const AppClientHeader = () => {
  return (
    <header className="w-full flex flex-col sticky top-0 z-50 shadow-xl">
      <div className="flex justify-around bg-third">
        <div className="flex justify-between w-myLayout text-[0.8rem] py-2">
          <span className="flex items-center ">
            <TfiHeadphoneAlt className="pr-2" size={20} />
            Gọi mua hàng: &nbsp;
            <b> Hà Nội: 0388.725.928 (8h-21h)</b>
            {/* <b> Tư vấn build PC: 0388.725.928 (8h-21h)</b>
            <b> Hà Nội: 0388.725.928 (8h-21h)</b> */}
          </span>
          <span>
            {navComponents.map((item, index) => {
              return (
                <a
                  href={item.path}
                  key={index}
                  className="pl-6 hover_text-theme hover_underline"
                >
                  {item.title}
                </a>
              );
            })}
          </span>
        </div>
      </div>
      <div className="bg-theme h-[5rem] shadow-md flex justify-center ">
        <div className="w-myLayout items-center grid grid-cols-5">
          <NavLink to="/" className="mr-20">
            <img src="/logo.svg.png" alt="logo" className="h-12" />
          </NavLink>
          <div className="col-span-3 flex items-center">
            <div className="flex min-h-full items-center space-x-2 w-full">
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm"
                className="w-full text-[1.1rem] h-[3rem]"
              />
              <Button type="submit" className="h-[3rem]">
                <FaSearch size={24} className="" />
              </Button>
            </div>
            <div className="flex flex-row space-x-[2rem] ml-20">
              <NavLink to="/" className="relative">
                <FiShoppingBag size={40} />
                <CounterLabel counter={6} />
              </NavLink>
              <NavLink to="/" className="relative">
                <LiaShippingFastSolid size={45} />
                <CounterLabel counter={6} />
              </NavLink>
            </div>
          </div>
          <CustomAvt
            avt="/avt.jpg"
            name="Nguyen Trung Hieu"
            alt="user"
            className="ml-10"
          />
        </div>
      </div>
    </header>
  );
};

export default AppClientHeader;
