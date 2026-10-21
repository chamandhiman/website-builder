import type { WidgetData } from "../widgetRegistry";

export interface StoreLocationItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
}

export interface StoreLocatorContent {
  heading: string;
  subheading: string;
  mapAddress: string;
  layout: "split" | "stacked";
  widthMode: "full" | "custom";
  maxWidth: string;
  mapHeight: string;
  borderRadius: number;
  paddingTop: number;
  paddingBottom: number;
  stores: StoreLocationItem[];
  [key: string]: unknown;
}

export interface StoreLocatorWidgetData extends WidgetData {
  content: StoreLocatorContent;
}

export const defaultStoreLocatorWidgetData: StoreLocatorWidgetData = {
  id: "store_locator-default",
  type: "store_locator",
  variant: "Split",
  content: {
    heading: "Find a Store Near You",
    subheading: "Visit any of our convenient locations or get direct driving directions.",
    mapAddress: "Times Square, New York, NY",
    layout: "split",
    widthMode: "custom",
    maxWidth: "1200px",
    mapHeight: "440px",
    borderRadius: 14,
    paddingTop: 48,
    paddingBottom: 48,
    stores: [
      {
        id: "loc-1",
        name: "Downtown Flagship Store",
        address: "150 Broadway, New York, NY 10038",
        phone: "(212) 555-0142",
        hours: "Mon - Sat: 9:00 AM - 8:00 PM",
      },
      {
        id: "loc-2",
        name: "Midtown Center",
        address: "45 Rockefeller Plaza, New York, NY 10111",
        phone: "(212) 555-0198",
        hours: "Mon - Sun: 10:00 AM - 9:00 PM",
      },
    ],
  },
  style: {},
  layout: {},
  responsive: {},
  animation: {},
  advanced: {},
};

export function isStoreLocatorWidgetData(data: WidgetData): data is StoreLocatorWidgetData {
  return data?.type === "store_locator";
}
