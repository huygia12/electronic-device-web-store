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
    <Card className={cn("rounded-2xl shadow-lg w-full px-10", props.className)}>
      <CardHeader className="py-6 px-10 flex flex-col items-stretch space-y-0 border-b p-0 sm_flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 py-5 sm_py-6">
          {activeChart === "revenue" ? (
            <>
              <CardTitle>Doanh thu</CardTitle>
              <CardDescription>
                Doanh thu từng ngày trong tháng {new Date().getMonth() + 1}
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle>Đơn hàng</CardTitle>
              <CardDescription>
                Số đơn hàng từng ngày trong tháng {new Date().getMonth() + 1}
              </CardDescription>
            </>
          )}
        </div>
        <div className="flex">
          {["revenue", "order"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even_border-l data-[active=true]_bg-muted/100 sm_border-l sm_border-t-0 sm_px-8 sm_py-6"
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
      <CardContent className="sm_py-16">
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
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => getDayOfMonthString(new Date(value))}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="min-w-[10rem]"
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
