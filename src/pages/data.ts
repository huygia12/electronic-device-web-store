import { Slide } from "@/types/model";

export const slides: { src: string; alt: string; link: string }[] = [
  { src: "/slideShow1.png", alt: "slide1", link: "/products" },
  { src: "/slideShow2.jpg", alt: "slide2", link: "/products" },
  { src: "/slideShow3.png", alt: "slide3", link: "/products" },
  { src: "/slideShow4.jpg", alt: "slide4", link: "/products" },
  { src: "/slideShow5.jpg", alt: "slide5", link: "/products" },
  { src: "/slideShow6.jpg", alt: "slide6", link: "/products" },
  { src: "/slideShow7.jpg", alt: "slide7", link: "/products" },
];

export const editingSlides: Slide[] = [
  {
    url: "/slideShow1.png",
    slideID: "slide1",
    ref: "/products",
    storeID: "slide",
    index: 1,
  },
  {
    url: "/slideShow2.jpg",
    slideID: "slide2",
    ref: "/products",
    storeID: "slide",
    index: 2,
  },
  {
    url: "/slideShow3.png",
    slideID: "slide3",
    ref: "/products",
    storeID: "slide",
    index: 3,
  },
  {
    url: "/slideShow4.jpg",
    slideID: "slide4",
    ref: "/products",
    storeID: "slide",
    index: 4,
  },
  {
    url: "/slideShow5.jpg",
    slideID: "slide5",
    ref: "/products",
    storeID: "slide",
    index: 5,
  },
  {
    url: "/slideShow6.jpg",
    slideID: "slide6",
    ref: "/products",
    storeID: "slide",
    index: 6,
  },
  {
    url: "/slideShow7.jpg",
    slideID: "slide7",
    ref: "/products",
    storeID: "slide",
    index: 7,
  },
];

export const LAPTOP_ID = "3f7ba103-bd25-4fcd-9116-fea7ee9a08f9";
export const PHONE_ID = "e5bee2b2-a457-46f4-992e-dd32e5e19b5a";
