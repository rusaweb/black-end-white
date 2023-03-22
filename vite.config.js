import { fileURLToPath, URL } from "url";

import {defineConfig, loadEnv} from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default ({ mode }) =>  {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return defineConfig({
    plugins: [vue()],
    base: process.env.VITE_BASE,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: true,
      proxy: {
        '/api': {
          target: process.env.VITE_BASE_URL,
          changeOrigin: true,
        }
      }
    },
  });
}
