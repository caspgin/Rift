import { describe, test, vi, expect, beforeEach } from 'vitest';
import {
	createBrowser,
	createView,
	DEFAULTS,
	registerKeymaps,
} from '../../src/main/browser';
import { BrowserWindow, WebContentsView } from 'electron';

vi.mock('electron', () => {
	const createWebContentsMock = () => ({
		loadURL: vi.fn(),
		id: 123,
		openDevTools: vi.fn(),
		on: vi.fn(),
		focus: vi.fn(),
		send: vi.fn(),
	});
	return {
		app: {
			whenReady: () => Promise.resolve(),
			on: vi.fn(),
			quit: vi.fn(),
		},
		BrowserWindow: vi.fn().mockImplementation(function() {
			return {
				loadFile: vi.fn(),
				setBrowserView: vi.fn(),
				on: vi.fn(),
				removeMenu: vi.fn(),
				contentView: { addChildView: vi.fn() },
				getBounds: vi.fn(),
				webContents: createWebContentsMock(),
			};
		}),
		WebContentsView: vi.fn().mockImplementation(function() {
			return {
				setBounds: vi.fn(),
				webContents: createWebContentsMock(),
			};
		}),
	};
});

describe('Browser Logic Engine', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('createBrowser should return BrowserType Object', () => {
		const state = createBrowser();

		expect(state.views).toBeInstanceOf(Map);
		expect(state.views).toBeDefined();
		expect(state.views.size).toBe(0);
		expect(state.activeViewId).toBe(0);

		expect(state.window).toBeDefined();
		expect(state.window.loadFile).toHaveBeenCalledWith(
			expect.stringContaining('index.html'),
		);
		const calls = (state.window.on as any).mock.calls;
		const callback = calls.find((c: any) => c[0] === 'resize')[1];
		expect(state.window.on).toHaveBeenCalledWith(
			expect.stringMatching('resize'),
			callback,
		);
		const view = new WebContentsView();
		state.views.set(1, view);
		(state.window.getBounds as any).mockReturnValue({
			width: 800,
			height: 800,
		});
		callback();

		expect(state.window.getBounds).toHaveBeenCalled();
		expect(state.views.get(1)?.setBounds).toHaveBeenCalledWith({
			x: DEFAULTS.webContentXBound,
			y: DEFAULTS.webContentYBound,
			width: 800 - DEFAULTS.webContentXBound,
			height: 800 - DEFAULTS.webContentYBound,
		});
	});

	test('createView function should create a view and add to state', () => {
		const state = createBrowser();

		expect(state.views.size).toBe(0);
		(state.window.getBounds as any).mockReturnValue({
			width: 500,
			height: 500,
		});
		createView(state, `https://google.com`);

		expect(WebContentsView).toHaveBeenCalled();

		expect(state.views.size).toBe(1);
		expect(state.views.get(123)).toBeDefined();
		const view = state.views.get(123);
		expect(state.window.getBounds).toHaveBeenCalled();
		expect(view?.setBounds).toHaveBeenCalledWith({
			x: DEFAULTS.webContentXBound,
			y: DEFAULTS.webContentYBound,
			width: 500 - DEFAULTS.webContentXBound,
			height: 500 - DEFAULTS.webContentYBound,
		});

		expect(view?.webContents.loadURL).toHaveBeenCalledWith(
			expect.stringMatching(`https://google.com`),
		);

		expect(state.window.contentView.addChildView).toHaveBeenCalled();
	});

	test('registerKeymaps test', () => {
		const state = createBrowser();

		const webContentView = new WebContentsView({});

		registerKeymaps(webContentView.webContents, state);

		expect(webContentView.webContents.on).toHaveBeenCalled();
		const calls = (webContentView.webContents.on as any).mock.calls;
		const callback = calls.find(
			(c: any) => c[0] === 'before-input-event',
		)[1];

		const event = { preventDefault: vi.fn() };
		const input = { control: true, meta: true, key: 'k' };
		callback(event, input);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(state.window.webContents.focus).toHaveBeenCalled();
		expect(state.window.webContents.send).toHaveBeenCalledWith(
			'focus-omnibox',
		);

		vi.clearAllMocks();

		input.key = 'q';
		callback(event, input);
		expect(event.preventDefault).not.toHaveBeenCalled();
		expect(state.window.webContents.focus).not.toHaveBeenCalled();
		expect(state.window.webContents.send).not.toHaveBeenCalledWith(
			'focus-omnibox',
		);
	});
});
