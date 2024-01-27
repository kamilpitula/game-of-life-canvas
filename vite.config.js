import tailwind from "tailwindcss";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  resolve: {},
  css: {
    postcss: {
      plugins: [tailwind],
    },
  },
});
