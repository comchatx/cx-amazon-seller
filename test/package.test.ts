import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { build } from "../scripts/build.mjs";
import { loadPackage, scratch } from "./pi.js";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const SELLER = "The person you talk with runs a business selling on Amazon and comes to you for the work of that business.";

it("the pinned pi loads the extension from the built dist/ and its section joins the prompt's options", async () => {
  expect(build(ROOT)).toEqual([join(ROOT, "dist", "extensions", "amazon-seller.js")]);
  const { extensions, errors, runner } = await loadPackage(ROOT);
  expect(errors).toEqual([]);
  expect(extensions.map((extension) => extension.path)).toEqual([join(ROOT, "dist", "extensions", "amazon-seller.js")]);
  expect(extensions.map((extension) => [...extension.handlers.keys()])).toEqual([["before_agent_start"]]);
  const { systemPromptOptions } = await runner.emitBeforeAgentStart("Hello", undefined, { cwd: "/project" });
  expect(systemPromptOptions.sections).toMatchObject({ "cx-amazon-seller": SELLER });
  expect(systemPromptOptions.forceSystemPrompt).toBeUndefined();
});

it("the build refuses a test under src/extensions/, which pi would load as an extension", () => {
  const root = scratch();
  mkdirSync(join(root, "src", "extensions"), { recursive: true });
  writeFileSync(join(root, "src", "extensions", "amazon-seller.ts"), "export default () => {};\n");
  writeFileSync(join(root, "src", "extensions", "amazon-seller.test.ts"), "export {};\n");
  expect(() => build(root)).toThrow("src/extensions/amazon-seller.test.ts is not an extension; tests live under test/");
});

it("the comchatx field is the card the product's catalogue record draws", async () => {
  const { readFileSync } = await import("node:fs");
  const manifest = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as Record<string, unknown>;
  expect(manifest["comchatx"]).toEqual({"name":"Amazon Core","nameZh":"亚马逊基础功能","about":"告诉 cx 你在亚马逊开店，来找它是为了店里的事。","mark":{"draw":[{"d":"M4.4 3.5h15.2l2 5.6H2.4zM2.6 10a2.35 2.35 0 0 0 4.7 0zM7.35 10a2.35 2.35 0 0 0 4.7 0zM12.1 10a2.35 2.35 0 0 0 4.7 0zM16.85 10a2.35 2.35 0 0 0 4.7 0z"},{"d":"M5.2 13.5h13.6a1 1 0 0 1 1 1v5.1a1 1 0 0 1 -1 1h-13.6a1 1 0 0 1 -1 -1v-5.1a1 1 0 0 1 1 -1zM9.8 15.4h4.4v5.2H9.8z","rule":"evenodd"}]},"section":"extensions","order":60});
});

it("ships its README in English and in Chinese", () => {
  // npm 12 keys its answer by the package's name; earlier ones answer a list.
  const answer = JSON.parse(execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], { cwd: ROOT, encoding: "utf8" })) as { files: { path: string }[] }[] | Record<string, { files: { path: string }[] }>;
  const packed = Array.isArray(answer) ? answer : Object.values(answer);
  expect(packed[0]!.files.map((file) => file.path)).toEqual(expect.arrayContaining(["README.md", "README.zh-CN.md"]));
});
