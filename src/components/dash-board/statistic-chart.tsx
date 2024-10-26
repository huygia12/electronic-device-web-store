import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getDayOfMonthString, getDateString } from "@/utils/helpers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC, HTMLAttributes, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { chartConfig } from "@/utils/constants";
import { statisticService } from "@/services";
import { InvoiceStatistic } from "@/types/payload";

interface StatisticChartProps extends HTMLAttributes<HTMLDivElement> {
  invoiceStatistic: InvoiceStatistic[];
}

const StatisticChart: FC<StatisticChartProps> = ({ ...props }) => {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("revenue");
  const total = useMemo<{ revenue: number; order: number }>(
    () =>
      statisticService.caculateTotalOfRevenueAndOrder(props.invoiceStatistic),
    [props.invoiceStatistic]
  );

  return (
    <Card className={cn("rounded-2xl shadow-lg w-full px-6", props.className)}>
      <CardHeader className="border-b p-0 flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1">
          {activeChart === "revenue" ? (
            <>
              <CardTitle>Doanh Thu</CardTitle>
              <CardDescription>
                {`Doanh thu trong tháng ${new Date().getMonth() + 1} (đơn vị VNĐ)`}
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle>Đơn Hàng</CardTitle>
              <CardDescription>
                Số đơn hàng trong tháng {new Date().getMonth() + 1}
              </CardDescription>
            </>
          )}
        </div>
        <div className="flex !mt-0">
          {["revenue", "order"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even_border-l data-[active=true]_bg-muted/100 sm_border-l"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm_text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-0 py-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[20rem] w-full"
        >
          <BarChart
            accessibilityLayer
            data={statisticService.getStatisticFromFirstDayOfMonth(
              props.invoiceStatistic
            )}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              minTickGap={20}
              tickFormatter={(value) => getDayOfMonthString(new Date(value))}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => getDateString(new Date(value))}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default StatisticChart;
