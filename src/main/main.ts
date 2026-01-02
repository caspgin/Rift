import { app, BrowserWindow, ipcMain, WebContentsView } from 'electron';
import {
	BrowserType,
	createBrowser,
	createView,
	registerIpcHandler,
} from './browser';
import { initAdBlocking } from './adblocker';

function setup() {
	const state: BrowserType = createBrowser();
	registerIpcHandler(state);
	initAdBlocking();
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
