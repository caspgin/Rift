import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
	navigate: (url: string) => ipcRenderer.send('navigate', url),
	onFocusOmnibox: (callback: () => void) =>
		ipcRenderer.on('focus-omnibox', () => callback()),
	onBlurOmnibox: (callback: () => void) =>
		ipcRenderer.on('blur-omnibox', () => callback()),
});
