import { HTMLAttributes, useState } from "react";

interface CustomImageProps extends HTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const CustomImage: React.FC<CustomImageProps> = ({ className, ...props }) => {
  const [loading, setLoading] = useState(true);

  return (
    <img
      {...props}
      src={props.src}
      alt={props.alt}
      className={className}
      style={{ display: loading ? "none" : "block" }}
      onLoad={() => setLoading(false)}
    />
  );
};

export default CustomImage;
