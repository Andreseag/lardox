import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel"; // <--- CAMBIO AQUÍ (sin /server)

// https://astro.build/config
export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  image: { domains: ["img.youtube.com"] },
  output: "server",
  adapter: vercel(),
});
