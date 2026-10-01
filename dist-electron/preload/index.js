import { ipcRenderer, contextBridge } from 'electron';
import { CHANNELS } from '../shared/ipc';
// Context bridge - Expose typed API to renderer
contextBridge.exposeInMainWorld('api', {
    // Invoke - For calling main process functions
    invoke: async (params) => {
        return ipcRenderer.invoke(params.channel, params.params);
    },
    // On - For listening to events from main process
    on: (params) => {
        ipcRenderer.on(params.channel, (_event, data) => {
            params.listener(data);
        });
    },
    // Once - For one-time listeners
    once: (params) => {
        ipcRenderer.once(params.channel, (_event, data) => {
            params.listener(data);
        });
    },
    // Remove listener
    off: (channel) => {
        ipcRenderer.removeAllListeners(channel);
    },
    // Channels - Available IPC channels
    channels: CHANNELS,
});
//# sourceMappingURL=index.js.map