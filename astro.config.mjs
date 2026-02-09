// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind"; // <--- This now points to v5
import vercel from "@astrojs/vercel";

import react from "@astrojs/react";

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind(), react()], // <--- Simple and clean
});