import { HTMLAttributes, LegacyRef, forwardRef, useState } from "react";

interface CustomImageProps extends HTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const CustomImage: React.FC<CustomImageProps> = forwardRef<
  HTMLImageElement,
  CustomImageProps
>((props, ref: LegacyRef<HTMLImageElement>) => {
  const [loading, setLoading] = useState(true);

  return (
    <img
      ref={ref}
      {...props}
      src={props.src}
      alt={props.alt}
      className={props.className}
      style={{ display: loading ? "none" : "block" }}
      onLoad={() => setLoading(false)}
    />
  );
});

export default CustomImage;
