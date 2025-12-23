import { app, BrowserWindow, WebContentsView } from 'electron';
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

    mainWindow.removeMenu();
    mainWindow.loadFile(path.join(rootPath, 'renderer', 'index.html'));

    const view = new WebContentsView({
        webPreferences: {
            nodeIntegration: false,
            plugins: false,
        },
    });

    view.setBounds({ x: 0, y: 60, width: 1200, height: 800 });
    view.webContents.loadURL('https://youtube.com/');
    mainWindow.contentView.addChildView(view);

    mainWindow.on('resize', () => {
        const rectangle = mainWindow.getBounds();
        view.setBounds({
            x: 0,
            y: 60,
            width: rectangle.width,
            height: rectangle.height,
        });
    });
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
