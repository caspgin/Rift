import { test, expect, vi, beforeEach } from 'vitest';
import { BrowserWindow } from 'electron';

vi.mock('electron', () => {
    return {
        app: {
            whenReady: () => Promise.resolve(),
            on: vi.fn(),
            quit: vi.fn(),
        },
        BrowserWindow: vi.fn().mockImplementation(function () {
            return {
                loadFile: vi.fn(),
                setBrowserView: vi.fn(),
                on: vi.fn(),
                removeMenu: vi.fn(),
                contentView: { addChildView: vi.fn() },
                getBounds: vi.fn(),
            };
        }),
        WebContentsView: vi.fn().mockImplementation(function () {
            return {
                setBounds: vi.fn(),
                webContents: {
                    loadURL: vi.fn(),
                },
            };
        }),
    };
});

test('Smoke Test: Electron mocks should be working', () => {
    const win = new BrowserWindow();
    expect(BrowserWindow).toHaveBeenCalled();
    expect(win.loadFile).toBeDefined();
});
