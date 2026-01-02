import { describe, expect, test } from 'vitest';

import { shouldBlock } from '../../src/main/adblocker';

describe('Adblock engine tests', () => {
	test('should block ads', () => {
		const badUrl = `https://googleads.g.doubleClick.net/pagead/ads?client=ca-pub-123`;
		expect(shouldBlock(badUrl)).toBe(true);
	});

	test('should not block regular sites', () => {
		const goodUrl = `https://google.com/search?q=electron+js`;
		expect(shouldBlock(goodUrl)).toBe(false);
	});

	test('should block common tracking scripts', () => {
		const trackerUrl = 'https://www.google-analytics.com/analytics.js';
		expect(shouldBlock(trackerUrl)).toBe(true);
	});
});
