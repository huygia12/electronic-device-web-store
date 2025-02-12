import { FC, HTMLAttributes } from "react";
import LazyImage from "./lazy-image";
import { cn } from "@/lib/utils";

interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  bannerUrl: string | null;
}

const Banner: FC<BannerProps> = ({ ...props }) => {
  return (
    <div className={cn("w-[12rem]", props.className)}>
      {props.bannerUrl && (
        <LazyImage
          src={props.bannerUrl}
          alt="sideBanner"
          className="rounded-lg animate-pulseZoom"
        />
      )}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[800%] h-[10%] bg-gradient-to-br from-transparent via-white/50 to-transparent opacity-50 animate-sweep-slow" />
      </div>
    </div>
  );
};

export default Banner;
