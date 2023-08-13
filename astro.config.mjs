import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	integrations: [solidJs()],
	redirects: {
		'/': {
			status: 302,
			destination: '/dashboard'
		}
	}
	,
	output: "server",
	adapter: node({
		mode: "middleware"
	}),
	build: {
		rollupOptions: {
			external: [
				/^firebase.*/,
			]
		}
	}
});
