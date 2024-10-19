import { cn } from "@/lib/utils";
import { FC, HTMLAttributes, useState } from "react";
import { Range } from "react-range";

interface PriceRangeSliderProps extends HTMLAttributes<HTMLDivElement> {
  min: number;
  max: number;
  step: number;
  defaultValues?: number[];
  onValueChange: (values: number[]) => void;
}

const PriceRangeSlider: FC<PriceRangeSliderProps> = ({
  min,
  max,
  step,
  onValueChange,
  defaultValues,
  className,
}) => {
  const [values, setValues] = useState<number[]>(defaultValues || [min, max]);

  const handleRangeChange = (newValues: number[]) => {
    setValues(newValues);
  };

  const handleFinalChange = () => {
    onValueChange(values);
  };

  return (
    <div className={cn("w-full px-4 py-4 relative", className)}>
      <div className="absolute -top-4 w-full flex justify-between text-base mb-2">
        <span className="-translate-x-1/3">{values[0].toLocaleString()}đ</span>
        <span>{values[1].toLocaleString()}đ</span>
      </div>

      <Range
        step={step}
        min={min}
        max={max}
        values={values}
        onChange={handleRangeChange}
        onFinalChange={handleFinalChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-2 bg-blue-300 rounded-md w-full relative"
          >
            <div
              className="absolute h-2 bg-blue-500 rounded-md"
              style={{
                left: `${((values[0] - min) / (max - min)) * 100}%`,
                right: `${((max - values[1]) / (max - min)) * 100}%`,
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            key={props.key}
            className="w-5 h-5 bg-blue-500 rounded-full shadow"
          />
        )}
      />
    </div>
  );
};

export default PriceRangeSlider;
