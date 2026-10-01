import { BrowserWindow } from 'electron';
export declare let mainWindow: BrowserWindow | null;
export declare function setMainWindow(window: BrowserWindow | null): void;
export declare function getMainWindow(): BrowserWindow;
