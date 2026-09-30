import { BrowserWindow } from 'electron';

export let mainWindow: BrowserWindow | null = null;

export function setMainWindow(window: BrowserWindow | null) {
  mainWindow = window;
}

export function getMainWindow() {
  return mainWindow;
}