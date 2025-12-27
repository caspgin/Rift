import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
	navigate: (url: string) => ipcRenderer.send('navigate', url),
});
