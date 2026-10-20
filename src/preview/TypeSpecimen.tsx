import { roleStyle } from "./role-style";

/** A short page of text in every role, so scale, families and overrides are visible together. */
export function TypeSpecimen() {
  return (
    <div className="space-y-2">
      <p style={roleStyle("display")}>Quarterly review</p>
      <h2 style={roleStyle("h1")}>Revenue held steady</h2>
      <h3 style={roleStyle("h2")}>What changed this quarter</h3>
      <h4 style={roleStyle("h3")}>New customers by region</h4>
      <p style={roleStyle("lead")}>
        Growth came from two regions, while churn stayed flat for the third quarter running.
      </p>
      <p style={roleStyle("body")}>
        The northern team closed eleven new accounts. Most were small, but two are likely to expand next year. Use{" "}
        <code style={roleStyle("code")}>report.csv</code> for the full list.
      </p>
      <p style={roleStyle("small")} className="text-muted-foreground">
        Figures are unaudited and rounded to the nearest thousand.
      </p>
      <p style={roleStyle("caption")} className="text-muted-foreground">
        Figure 1. Accounts opened per month.
      </p>
      <p style={roleStyle("label")}>Account owner</p>
    </div>
  );
}
