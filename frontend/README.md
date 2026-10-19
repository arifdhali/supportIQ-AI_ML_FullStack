# SupportIQ (React 19 + TypeScript + Vite + Tailwind 4 + shadcn/ui + motion)

- Public website (`/`, `/contact`): customers send a message through Contact Us. No customer accounts.
- Staff area (`/login`, `/agent/*`): agents manage, prioritize, assign and resolve tickets.

    npm install
    npm run dev

On the first `npm run dev` (and `npm run build`) the official shadcn CLI installs the UI components into
src/components/ui (needs internet once). To re-install or update them later: `npm run ui:add`.
The component list is in scripts/ensure-ui.mjs.

Mock mode (default, VITE_USE_MOCK=true) needs no backend.
Staff logins: agent@supportiq.dev / Agent@1234 (Technical Support) and meera@supportiq.dev / Agent@1234 (Billing, all departments).
Set VITE_USE_MOCK=false and VITE_API_URL to use the Express API (contracts in src/services/*.ts).
The public endpoint POST /tickets/public must be validated and rate-limited server-side.
