import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig((configEnv) => {
	const isDevelopment = configEnv.mode === "development";

	return {
		plugins: [react()],
		server: {
			port: 5173,
			proxy: {
				'/ecommdb/api/v1': {
					target: 'http://localhost:9091',
					changeOrigin: true,
				}
			}
		},
		css: {
			postcss: './postcss.config.js',
		},
	};
});
