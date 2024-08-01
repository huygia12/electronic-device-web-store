import { ChartData } from "@/types/component";
import { DollarSign, HandCoins, Inbox, ShoppingBag, Users } from "lucide-react";

export const cardItem = [
  {
    name: "Doanh thu",
    content: "12.000.000đ",
    subContent: "+20.1% so với hôm qua",
    icon: DollarSign,
  },
  {
    name: "Lợi nhuận",
    content: "6.000.000đ",
    subContent: "+20.1% so với hôm qua",
    icon: HandCoins,
  },
  {
    name: "Đơn hàng",
    content: "55",
    subContent: "+5 so với hôm qua",
    icon: ShoppingBag,
  },
  {
    name: "Số mặt hàng đang bán",
    content: "56",
    subContent: "",
    icon: Inbox,
  },
  {
    name: "Người dùng online",
    content: "4",
    subContent: "",
    icon: Users,
  },
];

export const revenueData: ChartData[] = [
  {
    name: "1/5/2024",
    revenue: 12000000,
  },
  {
    name: "2/5/2004",
    revenue: 4000000,
  },
  {
    name: "3/5/2004",
    revenue: 34000000,
  },
  {
    name: "4/5/2004",
    revenue: 40000000,
  },
  {
    name: "5/5/2004",
    revenue: 33000000,
  },
  {
    name: "6/5/2004",
    revenue: 400000,
  },
  {
    name: "7/5/2004",
    revenue: 41100000,
  },
];

export const slides: { src: string; alt: string; link: string }[] = [
  { src: "/slideShow1.png", alt: "slide1", link: "/products" },
  { src: "/slideShow2.jpg", alt: "slide2", link: "/products" },
  { src: "/slideShow3.png", alt: "slide3", link: "/products" },
  { src: "/slideShow4.jpg", alt: "slide4", link: "/products" },
  { src: "/slideShow5.jpg", alt: "slide5", link: "/products" },
  { src: "/slideShow6.jpg", alt: "slide6", link: "/products" },
  { src: "/slideShow7.jpg", alt: "slide7", link: "/products" },
];

export const LAPTOP_ID = "3f7ba103-bd25-4fcd-9116-fea7ee9a08f9";
export const PHONE_ID = "e5bee2b2-a457-46f4-992e-dd32e5e19b5a";
