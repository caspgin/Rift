import { parseInput } from './urlParser.js';

export function initRenderer() {
	const omnibox = document.getElementById('omnibox') as HTMLInputElement;
	if (!omnibox) return;
	omnibox.addEventListener('keydown', (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			const url = parseInput(omnibox.value);
			omnibox.value = url;
			window.api.navigate(url);
		}
	});
}

if (typeof window !== undefined) {
	initRenderer();
}
