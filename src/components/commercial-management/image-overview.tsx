import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface SlideOverviewProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  reference?: string | null;
  onUrlChange?: (value: string | null) => void;
}

const SlideOverview: FC<SlideOverviewProps> = ({ ...props }) => {
  const [text, setText] = useState<string>(props.reference || "");
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setText(props.reference || "");
  }, [props.src]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="min-w-[80vw] md_min-w-fit p-10 border-transparent bg-transparent shadow-none text-primary-softer">
        <img src={props.src} alt={props.alt} className="mx-auto max-h-[80vh]" />
        <div className="flex flex-row items-baseline gap-4 justify-center">
          <input
            className="mt-4 h-10 min-w-[13rem] rounded-lg px-2 text-sm md_text-xl text-black focus-visible_outline-0"
            placeholder="URL dẫn đến page khác..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            onClick={() => {
              props.onUrlChange &&
                props.onUrlChange(text && text.length > 0 ? text : null);
              setOpen(false);
            }}
            variant="destructive"
            className="h-10 text-sm md_text-xl"
          >
            Lưu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SlideOverview;
