import { FC, HTMLAttributes } from "react";
import CustomImage from "./custom-image";
import { cn } from "@/lib/utils";
import { Nullable } from "@/utils/declare";

interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  bannerUrl: Nullable<string>;
}

const Banner: FC<BannerProps> = ({ ...props }) => {
  return (
    <div className={cn("w-[12rem]", props.className)}>
      {props.bannerUrl && (
        <CustomImage
          src={props.bannerUrl}
          alt="sideBanner"
          className="rounded-lg"
        />
      )}
    </div>
  );
};

export default Banner;
