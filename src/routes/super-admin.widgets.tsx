import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { getAllWidgetRegistrations } from "@/components/builder/widgets/widgetRegistry";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Puzzle } from "lucide-react";

export const Route = createFileRoute("/super-admin/widgets")({
  component: SuperAdminWidgets,
});

function SuperAdminWidgets() {
  const widgets = useMemo(() => getAllWidgetRegistrations(), []);

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F5F5]">Widgets</h1>
        <p className="mt-1 text-sm text-[#969696]">Registered widget types and variants available in the builder.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {widgets.map((widget) => (
          <Card key={widget.id} className="border-[#363636] bg-[#1F1F1F] p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[#F5F5F5]">{widget.displayName}</p>
                <p className="text-xs text-[#969696]">{widget.type}</p>
              </div>
              <Badge variant="secondary" className="bg-[#363636] text-[#969696] border-transparent">
                {widget.category}
              </Badge>
            </div>
            <div className="mt-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#969696]">Variants</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {widget.supportedVariants.map((variant) => (
                  <span
                    key={variant}
                    className="rounded-md border border-[#363636] bg-[#171717] px-2 py-0.5 text-[10px] text-[#D0D0D0]"
                  >
                    {variant}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[10px] text-[#969696]">
              <Puzzle className="h-3 w-3" />
              {widget.supportedVariants.length} variants
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
