import { ipcRenderer, contextBridge } from 'electron';
import { CHANNELS, type IPCResponse, type IPCInvokeParams, type IPCListenerParams } from '../shared/ipc';

// Context bridge - Expose typed API to renderer
contextBridge.exposeInMainWorld('api', {
  // Invoke - For calling main process functions
  invoke: async <T = void>(params: IPCInvokeParams): Promise<IPCResponse<T>> => {
    return ipcRenderer.invoke(params.channel, params.params) as Promise<IPCResponse<T>>;
  },

  // On - For listening to events from main process
  on: (params: IPCListenerParams): void => {
    ipcRenderer.on(params.channel, (_event, data) => {
      params.listener(data);
    });
  },

  // Once - For one-time listeners
  once: (params: IPCListenerParams): void => {
    ipcRenderer.once(params.channel, (_event, data) => {
      params.listener(data);
    });
  },

  // Remove listener
  off: (channel: typeof CHANNELS[keyof typeof CHANNELS]): void => {
    ipcRenderer.removeAllListeners(channel);
  },

  // Channels - Available IPC channels
  channels: CHANNELS,
}) as {
  invoke: <T = void>(params: IPCInvokeParams) => Promise<IPCResponse<T>>;
  on: (params: IPCListenerParams) => void;
  once: (params: IPCListenerParams) => void;
  off: (channel: typeof CHANNELS[keyof typeof CHANNELS]) => void;
  channels: typeof CHANNELS;
};

// Type augmentations for TypeScript
declare global {
  interface Window {
    api: {
      invoke: <T = void>(params: IPCInvokeParams) => Promise<IPCResponse<T>>;
      on: (params: IPCListenerParams) => void;
      once: (params: IPCListenerParams) => void;
      off: (channel: typeof CHANNELS[keyof typeof CHANNELS]) => void;
      channels: typeof CHANNELS;
    };
  }
}