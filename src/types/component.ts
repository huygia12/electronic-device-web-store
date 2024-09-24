import { Nullable, Optional } from "@/utils/declare";
import { LucideIcon } from "lucide-react";

//Purchase phases
export interface Phase {
  id: string;
  title: string;
  icon: LucideIcon;
}

//Link Item
export interface LinkItem {
  name: string;
  visible: boolean;
  src?: string;
  handleClick?: () => void;
}

//Nav component
export interface AdminNavItem {
  name: string;
  url: string;
  icon: LucideIcon;
  hasChild: boolean;
  children: AdminNavSubItem[];
}

export interface AdminNavSubItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

//Store
export interface Banner {
  newBanner: Optional<File | null>;
  prevBanner: Nullable<string>;
}
