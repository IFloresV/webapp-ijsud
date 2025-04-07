import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
   const env = loadEnv(mode, process.cwd());
   return {
      plugins: [react()],
      css: {
         postcss: {
            plugins: [tailwindcss, autoprefixer],
         },
      },
      resolve: {
         alias: {
            "@components": resolve(__dirname, "src/components"),
            "@assets": resolve(__dirname, "src/assets"),
            "@utils": resolve(__dirname, "src/utils"),
            "@hooks": resolve(__dirname, "src/hooks"),
            "@pages": resolve(__dirname, "src/pages"),
            "@api": resolve(__dirname, "src/api"),
            "@context": resolve(__dirname, "src/context"),
            "@router": resolve(__dirname, "src/router"),
         },
      },
      server: {
         port: env.VITE_PORT,
      },
   };
});
