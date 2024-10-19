import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FC, HTMLAttributes } from "react";

interface ImageOverViewProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
}

const ImageOverView: FC<ImageOverViewProps> = ({ ...props }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="min-w-[50%] p-10 border-transparent bg-transparent shadow-none text-primary-softer">
        <img src={props.src} alt={props.alt} className="mx-auto max-h-[80vh]" />
      </DialogContent>
    </Dialog>
  );
};

export default ImageOverView;
