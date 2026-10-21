import type { ReactNode } from "react";
import type { ComponentName } from "@/core/components/component-catalogue";
import { ButtonDemo, CardDemo, DialogDemo } from "./demos/ActionDemos";
import { ChartDemo, TableDemo } from "./demos/DataDemos";
import { AlertDemo, BadgeDemo } from "./demos/FeedbackDemos";
import { CheckboxDemo, InputDemo, SelectDemo } from "./demos/FormDemos";
import { SidebarDemo, TabsDemo } from "./demos/NavigationDemos";

/** A live, interactive sample of each of the twelve components, styled by the scoped brand variables. */
export const COMPONENT_DEMOS: Record<ComponentName, () => ReactNode> = {
  Button: ButtonDemo,
  Badge: BadgeDemo,
  Card: CardDemo,
  Input: InputDemo,
  Select: SelectDemo,
  Checkbox: CheckboxDemo,
  Tabs: TabsDemo,
  Table: TableDemo,
  Alert: AlertDemo,
  Dialog: DialogDemo,
  Sidebar: SidebarDemo,
  Chart: ChartDemo,
};
