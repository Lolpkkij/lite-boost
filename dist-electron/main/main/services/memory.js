"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryService = void 0;
const electron_1 = require("electron");
const ipc_1 = require("../../shared/ipc");
const os_1 = __importDefault(require("os"));
const ps_list_1 = __importDefault(require("ps-list"));
const window_1 = require("../window");
class MemoryService {
    constructor() {
        this.intervalId = null;
        this.isWindowHidden = false;
        this.setupIpcHandlers();
        this.start();
    }
    setupIpcHandlers() {
        electron_1.ipcMain.handle(ipc_1.CHANNELS.MEMORY_INFO, async () => this.getMemoryInfo());
        electron_1.ipcMain.handle(ipc_1.CHANNELS.PROCESS_LIST, async () => this.getProcessList());
        electron_1.ipcMain.handle(ipc_1.CHANNELS.MEMORY_CLEAN, async (_event, mode) => {
            console.log(`Cleaning memory with mode: ${mode}`);
            await new Promise(resolve => setTimeout(resolve, 800));
            const mem = this.getMemoryInfo();
            const mainWindow = (0, window_1.getMainWindow)();
            if (mainWindow) {
                mainWindow.webContents.send('memory-info-updated', mem);
            }
            return { success: true, mode };
        });
        electron_1.ipcMain.on('window-visibility-changed', (_event, hidden) => {
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
            const mainWindow = (0, window_1.getMainWindow)();
            if (mainWindow) {
                mainWindow.webContents.send('memory-info-updated', mem);
            }
            this.getProcessList().then(list => {
                const mainWindow = (0, window_1.getMainWindow)();
                if (mainWindow) {
                    mainWindow.webContents.send('process-list-updated', list);
                }
            });
        }, interval);
    }
    getMemoryInfo() {
        const total = os_1.default.totalmem();
        const free = os_1.default.freemem();
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
            const list = await (0, ps_list_1.default)();
            const top = list
                .map(p => {
                const mem = p.memory;
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
        }
        catch (e) {
            console.error('Failed to list processes', e);
            return [];
        }
    }
}
exports.MemoryService = MemoryService;
//# sourceMappingURL=memory.js.map