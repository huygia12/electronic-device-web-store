import { LucideIcon } from "lucide-react";

interface AdminNavItem {
  name: string;
  url: string;
  icon: LucideIcon;
  hasChild: boolean;
  children: AdminNavSubItem[];
}

interface AdminNavSubItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

export type { AdminNavSubItem, AdminNavItem };
