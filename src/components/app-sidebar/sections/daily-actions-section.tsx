"use client";

import { Home, Settings } from "lucide-react";
import { SectionLinks } from "../section-links";

const links = [
  { name: "Dashboard", url: "/dashboard", icon: Home },
  { name: "Settings", url: "/settings", icon: Settings },
];

export const DailyActionsSection = () => (
  <SectionLinks links={links} title="Daily Actions" />
);
