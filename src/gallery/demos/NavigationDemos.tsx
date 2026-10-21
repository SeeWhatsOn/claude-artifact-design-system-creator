import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CONTROL } from "@/preview/brand-classes";

// shadcn dims inactive tabs with a translucent foreground; the brand's muted text is the colour checked for contrast.
const TAB = cn(CONTROL, "text-muted-foreground");

/** Navigation group: three tabs. */
export function TabsDemo() {
  return (
    <Tabs defaultValue="overview">
      <TabsList className={CONTROL}>
        <TabsTrigger value="overview" className={TAB}>
          Overview
        </TabsTrigger>
        <TabsTrigger value="activity" className={TAB}>
          Activity
        </TabsTrigger>
        <TabsTrigger value="settings" className={TAB}>
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-muted-foreground">
        Your projects at a glance.
      </TabsContent>
      <TabsContent value="activity" className="text-sm text-muted-foreground">
        Everything your team changed this week.
      </TabsContent>
      <TabsContent value="settings" className="text-sm text-muted-foreground">
        Names, members and billing.
      </TabsContent>
    </Tabs>
  );
}

/** Navigation group: a sidebar with the current page marked. */
export function SidebarDemo() {
  const items = ["Dashboard", "Projects", "Reports", "Team", "Settings"];
  return (
    <nav
      aria-label="Sample navigation"
      className="w-52 rounded-[var(--radius-card)] border border-sidebar-border bg-sidebar p-[var(--space-3)] text-sidebar-foreground"
    >
      <p className="px-[var(--space-2)] font-semibold">Acme</p>
      <ul className="mt-[var(--space-2)] space-y-0.5 text-sm">
        {items.map((item, index) => (
          <li key={item}>
            <a
              href="#gallery-sidebar"
              aria-current={index === 0 ? "page" : undefined}
              onClick={event => event.preventDefault()}
              className={cn(
                "block px-[var(--space-2)] py-[var(--space-1)]",
                CONTROL,
                index === 0
                  ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent",
              )}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
