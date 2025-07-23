import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const SERVER_PROTOCOL = env.SERVER_PROTOCOL || "http";
  const SERVER_DOMAIN = env.SERVER_DOMAIN || "localhost";
  const SERVER_PORT = env.SERVER_PORT || null;
  const PORT = !SERVER_PORT ? "" : `:${SERVER_PORT}`;

  const BASE_URL = `${SERVER_PROTOCOL}://${SERVER_DOMAIN}${PORT}`;

  return {
    plugins: [react()],
    css: {
      preprocessorOptions: {
        scss: {
          // silence deprecation warnings in node_modules
          quietDeps: true,
        },
      },
    },
    server: {
      proxy: {
        "/api": {
          target: BASE_URL,
          changeOrigin: true,
        },
      },
      port: Number(env.VITE_DEV_PORT ?? 5173),
    },
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __APP_MODE__: JSON.stringify(mode),
    },
  };
});
