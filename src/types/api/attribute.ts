interface AttributeOption {
  optionID: string;
  optionValue: string;
}

interface AttributeType {
  typeID: string;
  typeValue: string;
  options: AttributeOption[];
}

export type { AttributeOption, AttributeType };
