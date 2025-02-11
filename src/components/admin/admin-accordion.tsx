import { FC, HTMLAttributes } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NavLink } from "react-router-dom";
import { SheetClose } from "@/components/ui/sheet";
import { AdminNavSubItem } from "@/types/component";

interface AdminAccordionProps extends HTMLAttributes<HTMLDivElement> {
  subItems: AdminNavSubItem[];
}

const AdminAccordion: FC<AdminAccordionProps> = ({ className, ...props }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item">
        <AccordionTrigger>{props.children}</AccordionTrigger>
        <AccordionContent>
          {props.subItems.map((subItem, index) => {
            return (
              <NavLink
                key={index}
                to={subItem.url}
                className="text-[0.9rem] md_text-base text-secondary-foreground hover_text-primary"
              >
                <SheetClose className="flex items-center pl-7 pb-5 gap-2">
                  <subItem.icon />
                  <span className="text-nowrap"> {subItem.name} </span>
                </SheetClose>
              </NavLink>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AdminAccordion;
