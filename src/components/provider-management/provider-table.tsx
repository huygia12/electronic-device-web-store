import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@radix-ui/react-select";
import { Card, CardContent } from "@/components/ui/card";
import { Provider } from "@/types/model";
import { FC, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const columnHeaders = ["STT", "MÃ NHÃN HÀNG", "TÊN NHÃN HÀNG", "SỐ SẢN PHẨM"];

interface ProviderTableProps extends HTMLAttributes<HTMLDivElement> {
  providers: Provider[];
  selectedProvider: Provider | undefined;
  setSelectedProvider: (provider: Provider | undefined) => void;
}

const ProviderTable: FC<ProviderTableProps> = ({ ...props }) => {
  if (props.providers.length === 0) {
    return (
      <Card className={cn("rounded-xl shadow-lg", props.className)}>
        <CardContent className="flex flex-col p-4 h-[60vh] min-h-fit">
          <div className="flex flex-col items-center">
            <img width={500} src="/empty-box.svg" alt="emptyCart" />
            <span className="text-xl font-medium text-slate-500 mb-10">
              Bạn chưa có nhãn hàng nào!
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("rounded-xl shadow-lg", props.className)}>
      <CardContent className="flex flex-col p-4">
        <ScrollArea className="relative h-[56vh]">
          <Table>
            <TableHeader className="z-10 border-b-secondary-foreground border-b-2 sticky top-0 bg-white">
              <tr>
                {columnHeaders.map((item, key) => {
                  return (
                    <TableHead
                      key={key}
                      className=" text-center text-black font-extrabold text-[1rem]"
                    >
                      {item}
                    </TableHead>
                  );
                })}
              </tr>
            </TableHeader>
            <TableBody>
              {props.providers.map((provider, index) => (
                <TableRow
                  key={index}
                  className={cn(
                    "cursor-pointer",
                    props.selectedProvider?.providerID ===
                      provider.providerID && "bg-theme-softer"
                  )}
                  onClick={() => props.setSelectedProvider(provider)}
                >
                  <TableCell className="text-center text-base">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-center text-base">
                    {provider.providerID}
                  </TableCell>
                  <TableCell className="text-center text-base">
                    {provider.providerName}
                  </TableCell>
                  <TableCell className="text-center text-base">
                    {provider.productQuantity || "0"}
                  </TableCell>
                </TableRow>
              ))}
              <tr>
                <td>
                  <Separator />
                </td>
              </tr>
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProviderTable;
