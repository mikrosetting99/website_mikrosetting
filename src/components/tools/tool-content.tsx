import { VpnGenerator } from "./vpn-generator";
import { IpCalculator } from "./ip-calculator";
import { GenericScriptGenerator } from "./generic-script-generator";

export function ToolContent({ slug, name }: { slug: string; name: string }) {
  switch (slug) {
    case "vpn-mikrotik":
      return <VpnGenerator />;
    case "ip-calculator":
      return <IpCalculator />;
    default:
      return <GenericScriptGenerator toolName={name} />;
  }
}
