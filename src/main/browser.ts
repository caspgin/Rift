import {
	BrowserWindow,
	ipcMain,
	Rectangle,
	WebContents,
	WebContentsView,
} from 'electron';
import path from 'path';

export const DEFAULTS = {
	windowWidth: 1200,
	windowHeight: 800,
	webContentYBound: 40,
	webContentXBound: 0,
};

export interface BrowserType {
	window: BrowserWindow;
	views: Map<number, WebContentsView>;
	activeViewId: number;
}

export function registerKeymaps(webContents: WebContents, state: BrowserType) {
	webContents.on(
		'before-input-event',
		(event: Electron.Event, input: Electron.Input) => {
			if (
				(input.control || input.meta) &&
				input.key.toLowerCase() === 'k'
			) {
				event.preventDefault();
				state.window.webContents.focus();
				state.window.webContents.send('focus-omnibox');
			} else if (input.key === 'Escape') {
				event.preventDefault();
				state.window.webContents.send('blur-omnibox');
				const activeView = state.views.get(state.activeViewId);
				if (!activeView) return;
				activeView?.webContents.focus();
			}
		},
	);
}

export function registerIpcHandler(state: BrowserType) {
	ipcMain.on('navigate', (event, url) => {
		const activeView = state.views.get(state.activeViewId);
		if (activeView) {
			activeView.webContents.loadURL(url);
		}
	});
}

export function createView(state: BrowserType, url: string): void {
	//create and setup view
	const view: WebContentsView = new WebContentsView({
		webPreferences: {
			nodeIntegration: false,
			plugins: false,
			devTools: false,
		},
	});
	registerKeymaps(view.webContents, state);

	const size: Rectangle = state.window.getBounds();
	view.setBounds({
		x: DEFAULTS.webContentXBound,
		y: DEFAULTS.webContentYBound,
		width: size.width - DEFAULTS.webContentXBound,
		height: size.height - DEFAULTS.webContentYBound,
	});

	view.webContents.loadURL(url);

	//add to window contentView and state.views and set it as active
	state.window.contentView.addChildView(view);
	state.views.set(view.webContents.id, view);
	state.activeViewId = view.webContents.id;
}

export function createBrowser(): BrowserType {
	//create the BrowserWindow
	const window = new BrowserWindow({
		width: DEFAULTS.windowWidth,
		height: DEFAULTS.windowHeight,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	window.removeMenu();
	window.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));

	//Create the state to be Returned
	const state: BrowserType = {
		window: window,
		views: new Map(),
		activeViewId: 0,
	};

	//set the resize event for each view in views
	window.on('resize', () => {
		const size = window.getBounds();
		state.views.forEach((view) => {
			view.setBounds({
				x: DEFAULTS.webContentXBound,
				y: DEFAULTS.webContentYBound,
				width: size.width - DEFAULTS.webContentXBound,
				height: size.height - DEFAULTS.webContentYBound,
			});
		});
	});
	registerKeymaps(window.webContents, state);

	window.on('focus', () => {
		const activeView: WebContentsView | undefined = state.views.get(
			state.activeViewId,
		);
		if (!activeView) return;
		activeView.webContents.focus();
	});

	return state;
}
