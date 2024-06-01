import React, { HTMLAttributes } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { AdminNavSubItem } from "@/declare";
import { NavLink } from "react-router-dom";

interface AdminAccordionProps extends HTMLAttributes<HTMLDivElement> {
  subItems: AdminNavSubItem[];
}

const AdminAccordion: React.FC<AdminAccordionProps> = ({
  className,
  ...props
}) => {
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
                className="text-[1.1rem] flex pl-8 pb-5 text-secondary-foreground hover_text-primary"
              >
                <span className="mr-3"> {subItem.icon} </span>
                {subItem.name}
              </NavLink>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AdminAccordion;
