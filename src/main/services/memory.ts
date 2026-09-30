import { ipcMain } from 'electron';
import { CHANNELS, type MemoryInfo } from '../../shared/ipc';
import os from 'os';
import psList from 'ps-list';
import { getMainWindow } from '../window';

export class MemoryService {
  private intervalId: NodeJS.Timeout | null = null;
  private isWindowHidden = false;

  constructor() {
    this.setupIpcHandlers();
    this.start();
  }

  private setupIpcHandlers() {
    ipcMain.handle(CHANNELS.MEMORY_INFO, async () => this.getMemoryInfo());
    ipcMain.handle(CHANNELS.PROCESS_LIST, async () => this.getProcessList());
    
    ipcMain.handle(CHANNELS.MEMORY_CLEAN, async (_event, mode: string) => {
      console.log(`Cleaning memory with mode: ${mode}`);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mem = this.getMemoryInfo();
      const mainWindow = getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('memory-info-updated', mem);
      }
      
      return { success: true, mode };
    });

    ipcMain.on('window-visibility-changed', (_event, hidden: boolean) => {
      this.isWindowHidden = hidden;
      this.restartInterval();
    });
  }

  private start() {
    this.restartInterval();
  }

  private restartInterval() {
    if (this.intervalId) clearInterval(this.intervalId);
    const interval = this.isWindowHidden ? 10000 : 2000;
    this.intervalId = setInterval(() => {
      const mem = this.getMemoryInfo();
      const mainWindow = getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('memory-info-updated', mem);
      }
      
      this.getProcessList().then(list => {
        const mainWindow = getMainWindow();
        if (mainWindow) {
          mainWindow.webContents.send('process-list-updated', list);
        }
      });
    }, interval);
  }

  private getMemoryInfo(): MemoryInfo {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const usedPercent = Math.round((used / total) * 100);
    const freePercent = 100 - usedPercent;
    return {
      totalBytes: total,
      availableBytes: free,
      usedBytes: used,
      usedPercentage: usedPercent,
      freePercentage: freePercent,
    };
  }

  private async getProcessList() {
    try {
      const list = await psList();
      const top = list
        .map(p => {
          const mem = p.memory as any;
          return {
            pid: p.pid,
            name: p.name,
            workingSet: mem?.rss ?? mem ?? 0,
            privateBytes: mem?.private ?? mem ?? 0,
          };
        })
        .sort((a, b) => b.workingSet - a.workingSet)
        .slice(0, 15);
      return top;
    } catch (e) {
      console.error('Failed to list processes', e);
      return [];
    }
  }
}