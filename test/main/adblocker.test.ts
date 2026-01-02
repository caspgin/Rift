import { describe, expect, test, vi } from 'vitest';

import { buildSet, shouldBlock } from '../../src/main/adblocker';

describe('Adblock engine tests', () => {
	test('buildSet test', async () => {
		const hashSet: Set<string> = new Set<string>();
		expect(hashSet.size).toBe(0);
		const spy = vi.spyOn(console, 'log');
		await buildSet('assets/hosts.txt', hashSet);

		expect(hashSet.size).toBe(82907);
		expect(spy).toHaveBeenCalledWith(
			`Read ${hashSet.size} domains for exact blocking in set`,
		);
	});
	test('should block ads', () => {
		const mockSet = new Set(['doubleclick.net', 'ads.google.com']);
		expect(shouldBlock('https://doubleclick.net/js', mockSet)).toBe(true);
		expect(shouldBlock('https://safe.com', mockSet)).toBe(false);
	});

	test('FAILS: should block subdomains of blocked domains', () => {
		const mockSet = new Set(['doubleclick.net']);
		expect(shouldBlock('https://ads.doubleclick.net', mockSet)).toBe(false);
	});
});
