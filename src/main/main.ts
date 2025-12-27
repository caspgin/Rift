import { app, BrowserWindow, WebContentsView } from 'electron';
import {
	BrowserType,
	createBrowser,
	createView,
	handleIpcRegister,
} from './browser';

function setup() {
	const state: BrowserType = createBrowser();
	handleIpcRegister(state);
	createView(state, `https://google.com`);
}

app.whenReady().then(() => {
	setup();
	//MacOs pattern
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length == 0) {
			//create a window
			setup();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
