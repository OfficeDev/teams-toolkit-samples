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
        port: 3000,
    },
});
