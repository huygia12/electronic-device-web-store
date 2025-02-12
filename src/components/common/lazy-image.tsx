import { HTMLAttributes, LegacyRef, forwardRef } from "react";

interface CustomImageProps extends HTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
}

const LazyImage: React.FC<CustomImageProps> = forwardRef<
  HTMLImageElement,
  CustomImageProps
>((props, ref: LegacyRef<HTMLImageElement>) => {
  return (
    <img
      ref={ref}
      {...props}
      src={props.src}
      loading="lazy"
      alt={props.alt}
      className={props.className}
    />
  );
});

export default LazyImage;
