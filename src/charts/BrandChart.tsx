import type { CSSProperties } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { chartVar, type ChartData } from "@/core/charts/chart-svg";
import { cn } from "@/lib/utils";

// Recharts wants one object per category; series names become keys, so they're turned into safe CSS names.
function seriesKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/**
 * A grouped bar chart in the brand's chart colours: series n reads `--chart-n`, so it follows whatever theme
 * variables are in scope (a preview surface, a scene). Takes the same data as the static `barChartSvg`.
 */
export function BrandChart({ data, title, className }: { data: ChartData; title: string; className?: string }) {
  const keys = data.series.map(series => seriesKey(series.name));
  const config = Object.fromEntries(data.series.map((series, s) => [keys[s], { label: series.name }]));
  const rows = data.categories.map((category, c) => ({
    category,
    ...Object.fromEntries(data.series.map((series, s) => [keys[s], series.values[c] ?? 0])),
  }));
  // Colours are set as variables on the container, so they follow the surrounding theme without ChartStyle.
  const colours = Object.fromEntries(keys.map((key, s) => [`--color-${key}`, chartVar(s)])) as CSSProperties;

  return (
    <figure aria-label={title} style={colours} className={cn("m-0", className)}>
      <ChartContainer config={config} className="aspect-auto h-48 w-full">
        <BarChart data={rows} accessibilityLayer={false}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="category" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={32} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {keys.map(key => (
            <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={2} />
          ))}
        </BarChart>
      </ChartContainer>
    </figure>
  );
}
