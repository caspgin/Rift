import { app, BrowserWindow } from 'electron';
import path from 'path';

const rootPath = path.join(__dirname, '..', '..', 'src');

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
		},
	});

	mainWindow.loadFile(path.join(rootPath, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
	//create a BrowserWindow
	createWindow();

	//MacOs pattern
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length == 0) {
			//create a window
			createWindow();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
