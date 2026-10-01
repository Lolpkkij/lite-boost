import { ipcMain } from 'electron';
import { CHANNELS } from '../../shared/ipc';
import os from 'os';
import psList from 'ps-list';
import { getMainWindow } from '../window';
export class MemoryService {
    constructor() {
        this.intervalId = null;
        this.isWindowHidden = false;
        this.setupIpcHandlers();
        this.start();
    }
    setupIpcHandlers() {
        ipcMain.handle(CHANNELS.MEMORY_INFO, async () => this.getMemoryInfo());
        ipcMain.handle(CHANNELS.PROCESS_LIST, async () => this.getProcessList());
        ipcMain.handle(CHANNELS.MEMORY_CLEAN, async (_event, mode) => {
            console.log(`Cleaning memory with mode: ${mode}`);
            await new Promise(resolve => setTimeout(resolve, 800));
            const mem = this.getMemoryInfo();
            const mainWindow = getMainWindow();
            if (mainWindow) {
                mainWindow.webContents.send('memory-info-updated', mem);
            }
            return { success: true, mode };
        });
        ipcMain.on('window-visibility-changed', (_event, hidden) => {
            this.isWindowHidden = hidden;
            this.restartInterval();
        });
    }
    start() {
        this.restartInterval();
    }
    restartInterval() {
        if (this.intervalId)
            clearInterval(this.intervalId);
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
    getMemoryInfo() {
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
    async getProcessList() {
        try {
            const list = await psList();
            const top = list
                .map(p => {
                // Cast as any to safely access potential memory properties that vary by OS/version
                const mem = p.memory;
                return {
                    pid: p.pid,
                    name: p.name,
                    workingSet: (typeof mem === 'number') ? mem : (mem?.rss ?? 0),
                    privateBytes: (typeof mem === 'number') ? mem : (mem?.private ?? 0),
                };
            })
                .sort((a, b) => b.workingSet - a.workingSet)
                .slice(0, 15);
            return top;
        }
        catch (e) {
            console.error('Failed to list processes', e);
            return [];
        }
    }
}
//# sourceMappingURL=memory.js.map