import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SaleTag from "./ui/saleTag";
import RatingPoint from "./ui/ratingPoint";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import Item from "@/declare";
import { afterDiscount, toVND } from "@/utils/currency";
import { FaCartPlus } from "react-icons/fa6";
import { Button } from "./ui/button";
import { NavLink } from "react-router-dom";

interface CardProductProps extends HTMLAttributes<HTMLDivElement> {
  item: Item;
}

const CardProduct: React.FC<CardProductProps> = ({ className, ...props }) => {
  return (
    <Card
      key={props.item.id}
      className={cn(
        "p-2.5 shadow-xl transition ease-out duration-300 hover_scale-105 relative",
        className
      )}
    >
      <NavLink to="/intro">
        <img src={props.item.img} alt="machine" />
        <CardHeader className="p-1.5 mt-10">
          <CardTitle className="text-[1.1rem] hover_underline hover_text-primary-foreground">
            {props.item.name}
          </CardTitle>
        </CardHeader>
      </NavLink>
      <CardContent className="p-2">
        <CardDescription className="mb-5 py-1 px-2 rounded-md bg-secondary flex flex-wrap">
          {props.children}
        </CardDescription>
        <div className="flex flex-row flex-wrap items-center justify-between">
          <div className="text-[1.1rem] text-primary-foreground truncate ...">
            {toVND(
              afterDiscount(
                Number(props.item.price),
                Number(props.item.discount)
              )
            )}
          </div>
          <del className="text-[0.8rem] text-secondary-foreground">
            {toVND(props.item.price)}
          </del>
        </div>
        <SaleTag
          percentage={`-${props.item.discount}%`}
          className="absolute top-0 left-[-1rem]"
        />
      </CardContent>
      <CardFooter className="py-2 text-[0.9rem] flex flex-col">
        <div className="flex">
          <RatingPoint
            rate={props.item.rates}
            iconSize={18}
            className="text-yellow-500"
          ></RatingPoint>
          <span className="font-light ml-2 truncate ...">
            {`(${props.item.comments} đánh giá)`}
          </span>
        </div>
        <div className="flex items-center space-x-6 mt-4">
          <Button>
            <FaCartPlus />
          </Button>
          <Button>Mua ngay</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardProduct;
