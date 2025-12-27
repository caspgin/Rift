import { describe, expect, test } from 'vitest';
import { parseInput } from '../../src/renderer/urlParser';

describe('URL Parser Engine Test', () => {
	test('should return url as it is', () => {
		expect(parseInput('https://youtube.com')).toBe('https://youtube.com');
		expect(parseInput('http://youtube.com')).toBe('http://youtube.com');
	});

	describe('should handle missing tld case', () => {
		test('should return as it is when url has protocol or subdomain but tld missing ', () => {
			expect(parseInput('https://youtube')).toBe('https://youtube');
			expect(parseInput('www.youtube')).toBe('https://www.youtube');
		});

		test('should treat as non-url if protocol, subdomain, tld missing', () => {
			expect(parseInput('youtube')).toBe(
				`https://www.google.com/search?q=${encodeURIComponent('youtube')}`,
			);
		});
	});

	test('should add missing or broken protocol to url', () => {
		expect(parseInput('youtube.com')).toBe('https://youtube.com');
		expect(parseInput('https:youtube.com')).toBe('https://youtube.com');
		expect(parseInput('https:/youtube.com')).toBe('https://youtube.com');
	});

	test('should treat non-urls as Google Searches', () => {
		expect(parseInput('hello world')).toBe(
			`https://www.google.com/search?q=${encodeURIComponent('hello world')}`,
		);
		expect(parseInput('HowBigIslondon?')).toBe(
			`https://www.google.com/search?q=${encodeURIComponent('HowBigIslondon?')}`,
		);
		expect(parseInput('localhost:')).toBe(
			`https://www.google.com/search?q=${encodeURIComponent('localhost:')}`,
		);
	});

	test('should handle local host correctly', () => {
		expect(parseInput('localhost:3000')).toBe(`http://localhost:3000`);
	});

	test('should handle paths and query parameters', () => {
		expect(parseInput('youtube.com/watch?v=123')).toBe(
			'https://youtube.com/watch?v=123',
		);
		expect(parseInput('example.com/foo/bar')).toBe(
			'https://example.com/foo/bar',
		);
	});
});
