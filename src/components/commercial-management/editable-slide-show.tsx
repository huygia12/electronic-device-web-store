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
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import SlideWrapper from "./slide-wrapper";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { useDropzone } from "react-dropzone";
import { ImageToSlide } from "@/types/payload";
import { FileImagePlaceholder } from "../common";
import { retrieveImageUrl } from "@/utils/helpers";

interface SlideShowProps extends HTMLAttributes<HTMLDivElement> {
  parentSlides: (Slide | ImageToSlide)[];
  onSlideAddition: (slides: ImageToSlide) => void;
  onSlideDeletion: (slideIndex: string) => void;
  onRefChange: (value: string | null, index: number) => void;
  onSlideMove: (slidesAfterMove: (Slide | ImageToSlide)[]) => void;
}

const EditableSlideShow: FC<SlideShowProps> = ({ className, ...props }) => {
  const [slides, setSlides] = useState<(Slide | ImageToSlide)[]>(
    props.parentSlides
  );
  const slideIds = useMemo(() => slides.map((slide) => slide.index), [slides]);
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
    let newIndex: number = 1;
    setSlides((prevSlides) => {
      newIndex = prevSlides.length + 1;
      return [
        ...prevSlides,
        {
          file: acceptedFiles[0],
          url: retrieveImageUrl(acceptedFiles[0]),
          ref: null,
          index: newIndex,
        },
      ];
    });

    props.onSlideAddition({
      file: acceptedFiles[0],
      url: retrieveImageUrl(acceptedFiles[0]),
      ref: null,
      index: newIndex,
    });
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

    setSlides((prevSlides) => {
      const activeSlideIndex = prevSlides.findIndex(
        (slide) => slide.index === active.id
      );

      const overSlideIndex = prevSlides.findIndex(
        (slide) => slide.index === over.id
      );

      props.onSlideMove(
        arrayMove(props.parentSlides, activeSlideIndex, overSlideIndex)
      );
      return arrayMove(prevSlides, activeSlideIndex, overSlideIndex);
    });
  };

  const handleDeleteSlide = (slideIndex: string) => {
    setSlides((prevSlides) =>
      prevSlides.filter((slide) => `${slide.index}` !== slideIndex)
    );
    props.onSlideDeletion(slideIndex);
  };

  return (
    <div
      className={cn(
        "grid lg_grid-cols-2 2xl_grid-cols-3 gap-6 px-4",
        className
      )}
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={slideIds}>
          {slides.map((slide) => (
            <SlideWrapper
              key={slide.index}
              slide={slide}
              handleDeleteSlide={handleDeleteSlide}
              onUrlChange={(value) => props.onRefChange(value, slide.index)}
            />
          ))}
        </SortableContext>

        {createPortal(
          <DragOverlay>
            {activeSlide && (
              <SlideWrapper
                slide={activeSlide}
                handleDeleteSlide={handleDeleteSlide}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>

      <div className="lg_col-span-2 2xl_col-span-3" {...getRootProps()}>
        <input {...getInputProps()} />
        <FileImagePlaceholder isDragActive={isDragActive} className="h-40" />
      </div>
    </div>
  );
};

export default EditableSlideShow;
