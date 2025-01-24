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
    let dateHolder;
    const statistic: InvoiceStatistic[] = [];

    while (dayInMonth <= now) {
      const searchingResult = chartData.find(
        (d) => new Date(d.date).getDate() + 1 === dayInMonth.getDate() //Because it is ISO, so it must add 1
      ); //Find if the date iterator had figures or not
      if (searchingResult) {
        dateHolder = new Date(searchingResult.date);
        dateHolder.setUTCHours(17);
        dateHolder.setDate(dateHolder.getDate());
        statistic.push({
          ...searchingResult,
          date: dateHolder.toISOString(),
        });
      } else {
        dateHolder = new Date(dayInMonth);
        dateHolder.setDate(dateHolder.getDate());
        statistic.push({
          revenue: 0,
          order: 0,
          date: dateHolder.toISOString(),
        });
      }

      dayInMonth = getTheFollowingDay(dayInMonth);
    }

    return statistic;
  },
};

export default statisticService;
