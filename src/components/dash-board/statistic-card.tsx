import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { FC, HTMLAttributes } from "react";

interface StatisticCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  icon: LucideIcon;
  content: string;
  subContent?: string;
}

const StatisticCard: FC<StatisticCardProps> = ({ ...props }) => {
  return (
    <Card className="min-w-[200px] rounded-2xl shadow-lg">
      <CardHeader className="rounded-t-xl flex flex-row items-center justify-between px-5 pt-4 pb-2">
        <CardTitle className="text-[1rem] max-w-[80%] truncate ...">
          {props.name}
        </CardTitle>
        <span className="place-items-start">
          <props.icon />
        </span>
      </CardHeader>
      <CardContent className="flex flex-col px-6 pb-4">
        <div className="text-[2rem] font-extrabold truncate ...">
          {props.content}
        </div>
        <div className="max-w truncate ...">{props.subContent}</div>
      </CardContent>
    </Card>
  );
};

export default StatisticCard;
