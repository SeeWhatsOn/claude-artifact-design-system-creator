/** What every catalogue entry (a component or a pattern) has: the fields its preview card and README are built from. */
export type CatalogueEntry<Group extends string = string> = {
  /** The name people read, e.g. "Bar chart". */
  title: string;
  /** The group it is listed under, e.g. "Actions". */
  group: Group;
  /** Preview card height in px. */
  height: number;
  /** One sentence, ending in a full stop: the Design System page shows it as the summary. */
  summary: string;
  rules: string[];
};
