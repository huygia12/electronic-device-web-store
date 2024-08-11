interface AttributeOption {
  optionID: string;
  optionValue: string;
  typeID: string;
}

interface AttributeType {
  typeID: string;
  typeValue: string;
}

interface Attribute {
  typeID: string;
  typeValue: string;
  attributeOptions: AttributeOption[];
}

type ProductAttribute = AttributeOption & { attributeType: AttributeType };

export type { AttributeOption, AttributeType, Attribute, ProductAttribute };
