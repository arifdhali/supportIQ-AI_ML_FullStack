// Installs the real shadcn/ui components (source files in src/components/ui) using the official CLI.
// Runs automatically before `npm run dev` / `npm run build` when they are missing. Needs network access.
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const COMPONENTS = [
  "accordion", "alert", "avatar", "badge", "button", "card", "chart", "checkbox", "collapsible", "empty", "field",
  "input", "label", "native-select", "pagination", "separator", "sidebar", "skeleton", "sonner", "spinner",
  "table", "tabs", "textarea",
];

if (!process.argv.includes("--force") && existsSync("src/components/ui/sidebar.tsx")) process.exit(0);
console.log("Installing shadcn/ui components…");
const r = spawnSync("npx", ["shadcn@latest", "add", ...COMPONENTS, "--yes", "--overwrite"], { stdio: "inherit", shell: true });
process.exit(r.status ?? 1);
