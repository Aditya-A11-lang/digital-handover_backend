# Handover

A responsive project handover workspace built with React, Vite, and React Router. Track projects, checklist readiness, reviews, team activity, and integrations from one dashboard.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The production build and Oxlint checks are available with `npm run build` and `npm run lint`.

## Demo behavior

- Visit **Get started** to create a local demo account, or sign in with any email and password.
- Projects, checklist updates, integrations, and activity are saved in the current browser's `localStorage`.
- The assistant and readiness insights use local project data; they do not call an AI service.
- Integration toggles are illustrative and do not connect to external products.
- The optional `src/services/supabase.js` module provides a small REST helper when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured. The demo app does not currently use it.

This is a front-end prototype, not a production authentication or data-storage system. Demo passwords and workspace information are stored in browser storage and should not be used for real accounts or sensitive data.
