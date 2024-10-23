import { InvoiceStatistic, Statistic } from "@/types/payload";
import { axiosInstance } from "@/config";
import { getTheFollowingDay } from "@/utils/helpers";

const statisticEndpoint = "/statistic";

const statisticService = {
  apis: {
    getStatistic: async (): Promise<Statistic> => {
      const res = await axiosInstance.get<{ info: Statistic }>(
        `${statisticEndpoint}`
      );

      return res.data.info;
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

        dayInMonth = getTheFollowingDay(dayInMonth);
      }

      prev.push(curr);
      lastDayInChartData = curr.date;

      return prev;
    }, []);

    dayInMonth = getTheFollowingDay(dayInMonth);
    while (dayInMonth.getDate() < now.getDate()) {
      statistic.push({
        date: dayInMonth.toISOString(),
        revenue: 0,
        order: 0,
      });

      dayInMonth = getTheFollowingDay(dayInMonth);
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
