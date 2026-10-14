import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { expect, it } from "vitest";
import amazonSeller, { SECTION, SELLER } from "../src/extensions/amazon-seller.js";

it("sets its own section and leaves another package's in place", () => {
  const handlers: [string, (event: { systemPromptOptions: { sections: Record<string, string> } }) => unknown][] = [];
  amazonSeller({ on: (name: string, handler: never) => handlers.push([name, handler]) } as unknown as ExtensionAPI);
  expect(handlers.map(([name]) => name)).toEqual(["before_agent_start"]);
  const event = { systemPromptOptions: { sections: { assistant: "Who the assistant is." } } };
  expect(handlers[0]![1](event)).toBeUndefined();
  expect(event.systemPromptOptions.sections).toEqual({ assistant: "Who the assistant is.", [SECTION]: SELLER });
});

it("says one sentence, naming no tool, source or command", () => {
  expect(SECTION).toBe("cx-amazon-seller");
  expect(SELLER).toBe("The person you talk with runs a business selling on Amazon and comes to you for the work of that business.");
  expect(SELLER.split(/(?<=\.) /)).toHaveLength(1);
});
