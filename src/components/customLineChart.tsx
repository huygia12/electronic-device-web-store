import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartData } from "@/declare";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CustomLineChartProps extends HTMLAttributes<HTMLDivElement> {
  chartData: ChartData[];
}

const CustomLineChart: React.FC<CustomLineChartProps> = ({
  className,
  ...props
}) => {
  return (
    <ResponsiveContainer className={cn("w-full h-full", className)}>
      <LineChart data={props.chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
      </LineChart>
    </ResponsiveContainer>
  );
};

// const CustomTooltip = () => {
//   return <div></div>;
// };
export default CustomLineChart;
