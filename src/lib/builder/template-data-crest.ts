export type TemplateCategory = "Business" | "Portfolio" | "Freelancer" | "Agency" | "Restaurant";
export type TemplatePageType = "single-page" | "multi-page";

export interface TemplateSectionData {
  name: string;
  type: string;
  content: Record<string, any>;
  style?: Record<string, string>;
  className?: string;
  widgetType?: string;
}

export interface TemplatePageData {
  description?: string;
  accent?: string;
  thumbnail?: string;
  pageType?: string;
  tags?: string[];
  sections?: TemplateSectionData[];
}
