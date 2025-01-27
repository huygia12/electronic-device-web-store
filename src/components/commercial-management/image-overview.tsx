import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FC, HTMLAttributes, useState } from "react";
import { Button } from "@/components/ui/button";

interface SlideOverviewProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  reference?: string | null;
  onUrlChange?: (value: string | null) => void;
}

const SlideOverview: FC<SlideOverviewProps> = ({ ...props }) => {
  const [text, setText] = useState<string>(props.reference || ``);

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="min-w-[50%] p-10 border-transparent bg-transparent shadow-none text-primary-softer">
        <img src={props.src} alt={props.alt} className="mx-auto max-h-[80vh]" />
        <div className="flex flex-row items-baseline gap-4 justify-center">
          <input
            className="mt-4 h-10 w-[50rem] rounded-lg px-6 text-xl text-black focus-visible_outline-0"
            placeholder="URL dẫn đến page khác..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            onClick={() =>
              props.onUrlChange &&
              props.onUrlChange(text && text.length > 0 ? text : null)
            }
            variant="destructive"
            className="h-10"
          >
            Lưu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SlideOverview;
