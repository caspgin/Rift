//@vitest-environment happy-dom

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { initRenderer } from '../../src/renderer/renderer';
import { parseInput } from '../../src/renderer/urlParser';

describe('Integration testing omnibox and urlParser', () => {
	beforeEach(() => {
		// 1. Reset DOM
		document.body.innerHTML = '<input id="omnibox" />';
		(window as any).api = {
			navigate: vi.fn(),
			onFocusOmnibox: vi.fn(),
			onBlurOmnibox: vi.fn(),
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

	test('should test focus on omnibox', () => {
		const omnibox = document.getElementById('omnibox') as HTMLInputElement;
		const spyBox = vi.spyOn(omnibox, 'focus');
		let callback: Function | undefined;
		(window as any).api.onFocusOmnibox = (cb: Function) => {
			callback = cb;
		};

		initRenderer();

		if (callback) callback();
		expect(spyBox).toHaveBeenCalled();
	});
});
