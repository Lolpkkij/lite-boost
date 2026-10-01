"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const ipc_1 = require("../shared/ipc");
// Context bridge - Expose typed API to renderer
electron_1.contextBridge.exposeInMainWorld('api', {
    // Invoke - For calling main process functions
    invoke: async (params) => {
        return electron_1.ipcRenderer.invoke(params.channel, params.params);
    },
    // On - For listening to events from main process
    on: (params) => {
        electron_1.ipcRenderer.on(params.channel, (_event, data) => {
            params.listener(data);
        });
    },
    // Once - For one-time listeners
    once: (params) => {
        electron_1.ipcRenderer.once(params.channel, (_event, data) => {
            params.listener(data);
        });
    },
    // Remove listener
    off: (channel) => {
        electron_1.ipcRenderer.removeAllListeners(channel);
    },
    // Channels - Available IPC channels
    channels: ipc_1.CHANNELS,
});
//# sourceMappingURL=index.js.map