"use client";

import { Layers } from "lucide-react";
import { SectionLinks } from "../section-links";

const links = [{ name: "Categories", url: "/categories", icon: Layers }];

export const SettingsSection = () => (
  <SectionLinks links={links} title="Settings" />
);
