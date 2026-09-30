"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainWindow = exports.app = void 0;
const electron_1 = require("electron");
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return electron_1.app; } });
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
const ipc_1 = require("../shared/ipc");
const memory_1 = require("./services/memory");
(0, dotenv_1.config)();
let mainWindow = null;
exports.mainWindow = mainWindow;
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
        if (mainWindow) {
            if (mainWindow.isMinimized())
                mainWindow.restore();
            mainWindow.focus();
        }
    });
}
// Window management
function createWindow() {
    exports.mainWindow = mainWindow = new electron_1.BrowserWindow({
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
    mainWindow.on('closed', () => {
        exports.mainWindow = mainWindow = null;
    });
    // Auto-hide cursor when not moving
    mainWindow.on('blur', () => {
        mainWindow?.blur();
    });
    mainWindow.on('focus', () => {
        mainWindow?.showInactive();
    });
    // Window visibility detection
    mainWindow.on('enter-full-screen', () => {
        isAppVisible = true;
    });
    mainWindow.on('leave-full-screen', () => {
        isAppVisible = false;
    });
    mainWindow.on('enter-html-full-screen', () => {
        isAppVisible = true;
    });
    mainWindow.on('leave-html-full-screen', () => {
        isAppVisible = false;
    });
    // Start background timer for window visibility
    setInterval(() => {
        if (mainWindow && !mainWindow.isMinimized()) {
            isAppVisible = true;
        }
        else {
            isAppVisible = false;
        }
    }, 1000);
    return mainWindow;
}
// Toggle hardware acceleration
electron_1.app.disableHardwareAcceleration();
// Launch browser window
function startWindow() {
    exports.mainWindow = mainWindow = createWindow();
    mainWindow.loadFile(path_1.default.join(__dirname, '../renderer/index.html'));
}
electron_1.app.whenReady().then(() => {
    startWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
    // Register global shortcuts
    electron_1.globalShortcut.register('CommandOrControl+Shift+M', () => {
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
        mainWindow?.close();
    });
    // Electron IPC handlers
    electron_1.ipcMain.handle(ipc_1.CHANNELS.WINDOW_SET_BOUNDS, (_event, bounds) => {
        if (mainWindow) {
            mainWindow.setBounds(bounds);
        }
    });
    electron_1.ipcMain.handle(ipc_1.CHANNELS.WINDOW_SET_MINIMIZED, (_event, minimized) => {
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
    // Start background timer for window visibility
    setInterval(() => {
        if (mainWindow && !mainWindow.isMinimized()) {
            isAppVisible = true;
        }
        else {
            isAppVisible = false;
        }
    }, 1000);
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