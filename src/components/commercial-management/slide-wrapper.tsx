import { useSortable } from "@dnd-kit/sortable";
import { CustomImage, RemoveIcon } from "@/components/common";
import { FC, HTMLAttributes } from "react";
import { retrieveImageUrl } from "@/utils/helpers";
import { Slide } from "@/types/model";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { SlideInsertionPayload } from "@/types/payload";
import ImageOverView from "./image-overview";

interface SlideWrapperProps extends HTMLAttributes<HTMLDivElement> {
  slide: Slide | SlideInsertionPayload;
  handleDeleteSlide: (slideID: string) => void;
  onUrlChange?: (value: string | undefined) => void;
}

const SlideWrapper: FC<SlideWrapperProps> = ({ className, ...props }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.slide.index,
    data: {
      type: "Slide",
      slide: props.slide,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transition, transform: CSS.Transform.toString(transform) }}
      className={cn("relative", isDragging && "opacity-40", className)}
    >
      <ImageOverView
        src={props.slide.url}
        alt="sideBanner"
        reference={props.slide.ref}
        onUrlChange={props.onUrlChange}
      >
        <CustomImage
          src={retrieveImageUrl(props.slide.url)}
          alt="slide"
          className="rounded-lg "
        />
      </ImageOverView>
      {!isDragging && (
        <RemoveIcon
          onClick={() => props.handleDeleteSlide(`${props.slide.index}`)}
        />
      )}
    </div>
  );
};

export default SlideWrapper;
