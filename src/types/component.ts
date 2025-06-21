import { LucideIcon } from "lucide-react";

export interface Error {
  success: boolean;
  message?: string;
}

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
export interface SidebarItem {
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

//Banner
export interface Banner {
  newBanner: File | null | undefined;
  prevBanner: string | null;
}
