"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const electron_1 = require("electron");
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return electron_1.app; } });
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
const ipc_1 = require("../shared/ipc");
const memory_1 = require("./services/memory");
const window_1 = require("./window");
(0, dotenv_1.config)();
let isAppVisible = true;
let isMinimized = false;
// Initialize memory service
const memoryService = new memory_1.MemoryService();
// Single instance lock
const gotTheLock = electron_1.app.requestSingleInstanceLock();
if (!gotTheLock) {
    electron_1.app.quit();
}
else {
    electron_1.app.on('second-instance', () => {
        const mainWindow = (0, window_1.getMainWindow)();
        if (mainWindow) {
            if (mainWindow.isMinimized())
                mainWindow.restore();
            mainWindow.focus();
        }
    });
}
// Window management
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 900,
        height: 620,
        frame: false,
        transparent: false,
        resizable: false,
        webPreferences: {
            preload: path_1.default.join(__dirname, '../preload/index.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
        backgroundColor: '#1a1a2e',
    });
    (0, window_1.setMainWindow)(win);
    win.on('closed', () => {
        (0, window_1.setMainWindow)(null);
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
        const mainWindow = (0, window_1.getMainWindow)();
        if (mainWindow && !mainWindow.isMinimized()) {
            isAppVisible = true;
        }
        else {
            isAppVisible = false;
        }
    }, 1000);
    return win;
}
electron_1.app.disableHardwareAcceleration();
function startWindow() {
    const win = createWindow();
    win.loadFile(path_1.default.join(__dirname, '../renderer/index.html'));
}
electron_1.app.whenReady().then(() => {
    startWindow();
    electron_1.app.on('activate', () => {
        if ((0, window_1.getMainWindow)() === null) {
            createWindow();
        }
    });
    electron_1.globalShortcut.register('CommandOrControl+Shift+M', () => {
        const mainWindow = (0, window_1.getMainWindow)();
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            else {
                mainWindow.minimize();
            }
        }
    });
    electron_1.globalShortcut.register('CommandOrControl+Shift+X', () => {
        (0, window_1.getMainWindow)()?.close();
    });
    electron_1.ipcMain.handle(ipc_1.CHANNELS.WINDOW_SET_BOUNDS, (_event, bounds) => {
        (0, window_1.getMainWindow)()?.setBounds(bounds);
    });
    electron_1.ipcMain.handle(ipc_1.CHANNELS.WINDOW_SET_MINIMIZED, (_event, minimized) => {
        const mainWindow = (0, window_1.getMainWindow)();
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
    electron_1.ipcMain.handle(ipc_1.CHANNELS.WINDOW_SET_MAXIMIZED, (_event, maximized) => {
        const mainWindow = (0, window_1.getMainWindow)();
        if (mainWindow) {
            if (maximized) {
                mainWindow.maximize();
            }
            else {
                mainWindow.unmaximize();
            }
        }
    });
    electron_1.ipcMain.handle(ipc_1.CHANNELS.WINDOW_IS_MINIMIZED, (_event) => {
        return isMinimized;
    });
});
electron_1.app.on('will-quit', () => {
    electron_1.globalShortcut.unregisterAll();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
//# sourceMappingURL=index.js.map