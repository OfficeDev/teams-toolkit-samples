import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: "../dist",
    },
    resolve: {
        preserveSymlinks: true,
    },
    root: "./src",
    server: {
        hmr: {
            // Needed to make ngrok work with Vite
            clientPort: 443,
        },
    },
});
