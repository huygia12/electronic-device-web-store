import { InvoiceStatistic, Statistic } from "@/types/model";
import { axiosInstance, reqConfig } from "@/config";
import { Nullable } from "@/utils/declare";

const statisticService = {
  apis: {
    getStatistic: async (): Promise<Nullable<Statistic>> => {
      try {
        const res = await axiosInstance.get<{ info: Statistic }>(
          "/statistic",
          reqConfig
        );

        return res.data.info;
      } catch (error) {
        console.error("Unexpected error:", error);
        return null;
      }
    },
  },
  caculateTotalOfRevenueAndOrder: (
    chartData: InvoiceStatistic[]
  ): { revenue: number; order: number } => {
    return {
      revenue: chartData.reduce((acc, curr) => acc + curr.revenue, 0),
      order: chartData.reduce((acc, curr) => acc + curr.order, 0),
    };
  },
  getStatisticFromFirstDayOfMonth: (
    chartData: InvoiceStatistic[]
  ): InvoiceStatistic[] => {
    const now = new Date();
    let dayInMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    let lastDayInChartData: string | null = null;

    const statistic = chartData.reduce<InvoiceStatistic[]>((prev, curr) => {
      while (dayInMonth.getDate() < new Date(curr.date).getDate()) {
        prev.push({
          date: dayInMonth.toISOString(),
          revenue: 0,
          order: 0,
        });

        dayInMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          dayInMonth.getDate() + 1
        );
      }

      prev.push(curr);
      lastDayInChartData = curr.date;

      return prev;
    }, []);

    while (dayInMonth.getDate() < now.getDate()) {
      statistic.push({
        date: dayInMonth.toISOString(),
        revenue: 0,
        order: 0,
      });

      dayInMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        dayInMonth.getDate() + 1
      );
    }

    if (
      lastDayInChartData! &&
      new Date(lastDayInChartData).getDate() < now.getDate()
    ) {
      statistic.push({
        date: dayInMonth.toISOString(),
        revenue: 0,
        order: 0,
      });
    }

    return statistic;
  },
};

export default statisticService;
