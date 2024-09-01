interface Statistic {
  users: number;
  products: number;
  invoices: {
    today: number;
    yesterday: number;
  };
  revenue: {
    today: number;
    yesterday: number;
  };
}

export type { Statistic };
