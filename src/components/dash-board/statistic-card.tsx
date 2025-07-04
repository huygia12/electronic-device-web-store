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
    <Card className="min-w-[5rem] rounded-2xl shadow-lg">
      <CardHeader className="rounded-t-xl flex flex-row items-center justify-between px-5 pt-4 pb-2">
        <CardTitle className="text-xs md_text-base max-w-[80%]">
          {props.name}
        </CardTitle>
        <span className="ml-2 place-items-start">
          <props.icon />
        </span>
      </CardHeader>
      <CardContent className="flex flex-col px-6 pb-4">
        <div className="text-base  md_text-[2rem] font-extrabold truncate ...">
          {props.content}
        </div>
        <div className="max-w truncate ...">{props.subContent}</div>
      </CardContent>
    </Card>
  );
};

export default StatisticCard;
