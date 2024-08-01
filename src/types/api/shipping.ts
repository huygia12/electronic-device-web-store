interface ServiceRes {
  data: {
    service_id: number;
    service_type_id: number;
  }[];
}

interface ShippingAmountRes {
  data: {
    total: number;
  };
}

interface ShippingTimeRes {
  data: {
    leadtime: number;
  };
}

export type { ServiceRes, ShippingAmountRes, ShippingTimeRes };
