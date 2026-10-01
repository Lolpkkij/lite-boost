import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import path from 'path';
import { config } from 'dotenv';
import { CHANNELS } from '../shared/ipc';
import { MemoryService } from './services/memory';
import { setMainWindow, getMainWindow } from './window';
config();
let isAppVisible = true;
let isMinimized = false;
// Initialize memory service
const memoryService = new MemoryService();
// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
}
else {
    app.on('second-instance', () => {
        const mainWindow = getMainWindow();
        if (mainWindow) {
            if (mainWindow.isMinimized())
                mainWindow.restore();
            mainWindow.focus();
        }
    });
}
// Window management
function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 620,
        frame: false,
        transparent: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, '../preload/index.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
        backgroundColor: '#1a1a2e',
    });
    setMainWindow(win);
    win.on('closed', () => {
        setMainWindow(null);
    });
    win.on('blur', () => {
        win.blur();
    });
    win.on('focus', () => {
        win.showInactive();
    });
    win.on('enter-full-screen', () => {
        isAppVisible = true;
    });
    win.on('leave-full-screen', () => {
        isAppVisible = false;
    });
    win.on('enter-html-full-screen', () => {
        isAppVisible = true;
    });
    win.on('leave-html-full-screen', () => {
        isAppVisible = false;
    });
    setInterval(() => {
        const mainWindow = getMainWindow();
        if (mainWindow && !mainWindow.isMinimized()) {
            isAppVisible = true;
        }
        else {
            isAppVisible = false;
        }
    }, 1000);
    return win;
}
app.disableHardwareAcceleration();
function startWindow() {
    const win = createWindow();
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
}
app.whenReady().then(() => {
    startWindow();
    app.on('activate', () => {
        if (getMainWindow() === null) {
            createWindow();
        }
    });
    globalShortcut.register('CommandOrControl+Shift+M', () => {
        const mainWindow = getMainWindow();
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            else {
                mainWindow.minimize();
            }
        }
    });
    globalShortcut.register('CommandOrControl+Shift+X', () => {
        getMainWindow()?.close();
    });
    ipcMain.handle(CHANNELS.WINDOW_SET_BOUNDS, (_event, bounds) => {
        getMainWindow()?.setBounds(bounds);
    });
    ipcMain.handle(CHANNELS.WINDOW_SET_MINIMIZED, (_event, minimized) => {
        const mainWindow = getMainWindow();
        if (mainWindow) {
            if (minimized) {
                mainWindow.minimize();
                isMinimized = true;
            }
            else {
                mainWindow.restore();
                isMinimized = false;
            }
        }
    });
    ipcMain.handle(CHANNELS.WINDOW_SET_MAXIMIZED, (_event, maximized) => {
        const mainWindow = getMainWindow();
        if (mainWindow) {
            if (maximized) {
                mainWindow.maximize();
            }
            else {
                mainWindow.unmaximize();
            }
        }
    });
    ipcMain.handle(CHANNELS.WINDOW_IS_MINIMIZED, (_event) => {
        return isMinimized;
    });
});
app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
export { app };
//# sourceMappingURL=index.js.map