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

interface ProviderTableProps extends HTMLAttributes<HTMLDivElement> {
  providers: Provider[];
  selectedProvider: Provider | undefined;
  setSelectedProvider: (provider: Provider | undefined) => void;
}

const ProviderTable: FC<ProviderTableProps> = ({ ...props }) => {
  if (props.providers.length === 0) {
    return (
      <Card className={cn("rounded-md shadow-lg ", props.className)}>
        <CardContent className="flex flex-col p-0 xss_p-4 h-[60vh] min-h-fit">
          <div className="flex flex-col items-center">
            <img width={500} src="/empty-box.svg" alt="emptyCart" />
            <span className="text-base md_text-xl font-medium text-slate-500 mb-10">
              Bạn chưa có nhãn hàng nào!
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("rounded-md shadow-lg", props.className)}>
      <CardContent className="flex flex-col p-0 xss_p-4">
        <ScrollArea className="relative h-[56vh]">
          <Table>
            <TableHeader className="z-10 border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
              <tr className="text-black text-xs md_text-[1rem]">
                <TableHead className="text-center font-extrabold">
                  STT
                </TableHead>
                <TableHead className="text-center font-extrabold hidden lgg_block">
                  MÃ NHÃN HÀNG
                </TableHead>
                <TableHead className="text-center font-extrabold">
                  TÊN NHÃN HÀNG
                </TableHead>
                <TableHead className="text-center font-extrabold">
                  SỐ SẢN PHẨM
                </TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {props.providers.map((provider, index) => (
                <TableRow
                  key={index}
                  className={cn(
                    "cursor-pointer text-sm md_text-base",
                    props.selectedProvider?.providerID ===
                      provider.providerID && "bg-theme-softer"
                  )}
                  onClick={() => props.setSelectedProvider(provider)}
                >
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center hidden lgg_block">
                    {provider.providerID}
                  </TableCell>
                  <TableCell className="text-center">
                    {provider.providerName}
                  </TableCell>
                  <TableCell className="text-center">
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
