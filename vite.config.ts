import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig((configEnv) => {
	const isDevelopment = configEnv.mode === "development";

	return {
		plugins: [react()],
		server: {
			port: 5173,
			proxy: {
				'/api': {
					target: 'http://localhost:9091',
					changeOrigin: true,
				}
			}
		},
		css: {
			modules: {
				generateScopedName: isDevelopment ? "[name]__[local]__[hash:base64:5]" : "[hash:base64:5]",
			},
		},
	};
});
