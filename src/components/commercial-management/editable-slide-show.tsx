import { Slide } from "@/types/model";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { FC, HTMLAttributes, useCallback, useMemo, useState } from "react";
import { SortableContext } from "@dnd-kit/sortable";
import SlideWrapper from "./slide-wrapper";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { useDropzone } from "react-dropzone";
import { ImageToSlide } from "@/types/payload";
import { FileImagePlaceholder } from "../common";

interface SlideShowProps extends HTMLAttributes<HTMLDivElement> {
  originSlides: (Slide | ImageToSlide)[];
  onSlideAddition: (newImage: File) => void;
  onSlideDeletion: (slideIndex: string) => void;
  onSlideMove: (a: number, b: number) => void;
}

const EditableSlideShow: FC<SlideShowProps> = ({ className, ...props }) => {
  const slideIds = useMemo(
    () => props.originSlides.map((slide) => slide.index),
    [props.originSlides]
  );
  const [activeSlide, setActiveSlide] = useState<Slide | ImageToSlide | null>(
    null
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    props.onSlideAddition(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Slide") {
      setActiveSlide(event.active.data.current.slide);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id === over.id) return;

    props.onSlideMove(Number(active.id) - 1, Number(over.id) - 1);
  };

  const handleDeleteSlide = (slideIndex: string) => {
    props.onSlideDeletion(slideIndex);
  };

  return (
    <div
      className={cn("grid sm_grid-cols-2 lg_grid-cols-3 gap-6 px-4", className)}
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={slideIds}>
          {props.originSlides.map((slide, index) => (
            <SlideWrapper
              key={index + 1}
              slide={slide}
              handleDeleteSlide={handleDeleteSlide}
              onUrlChange={(value) => {
                slide.ref = value ? value : "";
              }}
            />
          ))}
        </SortableContext>

        {createPortal(
          <DragOverlay>
            {activeSlide && (
              <SlideWrapper
                slide={activeSlide}
                handleDeleteSlide={handleDeleteSlide}
                onUrlChange={(value) => {
                  activeSlide.ref = value ? value : "";
                }}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>

      <div className="sm_col-span-2 lg_col-span-3" {...getRootProps()}>
        <input {...getInputProps()} />
        <FileImagePlaceholder
          isDragActive={isDragActive}
          className="h-[20rem]"
        />
      </div>
    </div>
  );
};

export default EditableSlideShow;
