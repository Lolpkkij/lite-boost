import { ipcMain } from 'electron';
import type { MemoryInfo } from '../shared/ipc';
import os from 'os';
import psList from 'ps-list';

export class MemoryService {
  private intervalId: NodeJS.Timeout | null = null;
  private isWindowHidden = false;

  constructor() {
    this.setupIpcHandlers();
    this.start();
  }

  private setupIpcHandlers() {
    // Provide immediate info on request
    ipcMain.handle('memory:info', async () => this.getMemoryInfo());
    ipcMain.handle('process:list', async () => this.getProcessList());
    // Allow renderer to react to updates
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
      // Emit updates for both memory and processes
      const mem = this.getMemoryInfo();
      ipcMain.emit('memory-info-updated', mem);
      this.getProcessList().then(list => {
        ipcMain.emit('process-list-updated', list);
      });
    }, interval);
  }

  private getMemoryInfo(): MemoryInfo {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const usedPercent = Math.round((used / total) * 100);
    const freePercent = 100 - usedPercent;
    // Page file info not directly available; set to 0 placeholders
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
      // Sort by memory usage (rss) descending, take top 15
      const top = list
        .map(p => ({
          pid: p.pid,
          name: p.name,
          workingSet: p.memory?.rss ?? 0,
          privateBytes: p.memory?.private ?? 0,
        }))
        .sort((a, b) => b.workingSet - a.workingSet)
        .slice(0, 15);
      return top;
    } catch (e) {
      console.error('Failed to list processes', e);
      return [];
    }
  }
}