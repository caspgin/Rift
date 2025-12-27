// @vitest-environment happy-dom
//
//

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { initRenderer } from '../../src/renderer/renderer';
import { parseInput } from '../../src/renderer/urlParser';

describe('Integration testing omnibox and urlParser', () => {
	beforeEach(() => {
		// 1. Reset DOM
		document.body.innerHTML = '<input id="omnibox" />';
		(window as any).api = {
			navigate: vi.fn(),
		};
	});
	test('should log parsed URL when Enter is pressed', () => {
		initRenderer();
		const input = document.getElementById('omnibox') as HTMLInputElement;
		input.value = 'google.com';
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
		const url = parseInput(input.value);
		expect((window as any).api.navigate).toHaveBeenCalledWith(
			`https://google.com`,
		);
		expect(url).toMatch(`https://google.com`);
	});
});
