import { Product } from "@/types/model";
import { FC, HTMLAttributes } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ProductTechnicalInfoProps extends HTMLAttributes<HTMLHeadElement> {
  product: Product;
}

const ProductTechnicalInformation: FC<ProductTechnicalInfoProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "border-slate-100 border-2 rounded-xl shadow-lg px-4 py-2 mt-10 hidden sms_block",
        className
      )}
    >
      <h5 className="font-semibold text-lg sms_text-xl md_text-[1.4rem] py-2">
        Thông số thiết bị
      </h5>
      <Table className="border-2 border-slate-200">
        <TableBody>
          {props.product.productAttributes.map((attr, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-center text-sm md_text-base">
                {attr.attributeOption.attributeType.typeValue}
              </TableCell>
              <TableCell className="text-center text-sm md_text-base">
                {attr.attributeOption.optionValue}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTechnicalInformation;
