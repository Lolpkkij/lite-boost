import { app, BrowserWindow, globalShortcut, ipcMain, systemPreferences, screen } from 'electron';
import path from 'path';
import { config } from 'dotenv';
import { CHANNELS, type MemoryInfo, type CPUInfo, type GPUInfo } from '../shared/ipc';

config();

let mainWindow: BrowserWindow | null = null;
let lastDatabaseFlush = 0;
const FLUSH_INTERVAL = 1000; // 1 second
let isAppVisible = true;
let isMinimized = false;

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Window management
function createWindow(): BrowserWindow {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 620,
    frameless: true,
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

  // Frameless window controls
  mainWindow.webContents.on('dom-ready', () => {
    mainWindow?.setWindowButtonVisibility(false);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Auto-hide cursor when not moving
  mainWindow.on('blur', () => {
    mainWindow?.blur();
  });

  mainWindow.on('focus', () => {
    mainWindow?.showInactive();
  });

  mainWindow.on('minimized', () => {
    isMinimized = true;
  });

  mainWindow.on('restore', () => {
    isMinimized = false;
  });

  // Window visibility detection - check if window is visible on screen
  mainWindow.on('show', () => {
    mainWindow?.blur();
  });

  return mainWindow;
}

// Toggle hardware acceleration
app.disableHardwareAcceleration();

// Launch browser window
function startWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = createWindow();
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(() => {
  startWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Register global shortcuts
  globalShortcut.register('CommandOrControl+Shift+M', () => {
    mainWindow?.toggleMinimize();
  });

  globalShortcut.register('CommandOrControl+Shift+X', () => {
    mainWindow?.close();
  });

  // Electron IPC handlers - System monitoring (placeholder)
  ipcMain.handle(CHANNELS.WINDOW_SET_BOUNDS, (_event, bounds: { x: number; y: number }) => {
    if (mainWindow) {
      mainWindow.setBounds(bounds);
    }
  });

  ipcMain.handle(CHANNELS.WINDOW_SET_MINIMIZED, (_event, minimized: boolean) => {
    if (mainWindow) {
      if (minimized) {
        mainWindow.minimize();
      }
    }
  });

  ipcMain.handle(CHANNELS.WINDOW_SET_MAXIMIZED, (_event, maximized: boolean) => {
    if (mainWindow) {
      if (maximized) {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.handle(CHANNELS.WINDOW_IS_MINIMIZED, (_event) => {
    return isMinimized;
  });

  // Start background timer for window visibility
  setInterval(() => {
    if (mainWindow && mainWindow.isVisible()) {
      isAppVisible = true;
    } else {
      isAppVisible = false;
    }
  }, 1000);
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

export { app, mainWindow };