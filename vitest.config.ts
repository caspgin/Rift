import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		include: ['test/**/*.test.ts'],
		globals: true,
		coverage: {
			enabled: true,
			provider: 'v8',
			include: ['src/**/*.ts'],
			reporter: ['text', 'json', 'html'],
		},
	},
});
