import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/** The section's name is the package's own, so it stands beside who cx is (`cx-assistant`'s `assistant`) and replaces nothing. */
export const SECTION = "cx-amazon-seller";

/** Who the seller is: one sentence, naming no tool, source or command. */
export const SELLER = "The person you talk with runs a business selling on Amazon and comes to you for the work of that business.";

/** As `cx-assistant` does: the section joins pi's structured options, so pi appends it and keeps its transcript delta. */
export default function amazonSeller(pi: ExtensionAPI): void {
  pi.on("before_agent_start", (event) => {
    event.systemPromptOptions.sections[SECTION] = SELLER;
  });
}
