import { CHANNELS, type IPCResponse, type IPCInvokeParams, type IPCListenerParams } from '../shared/ipc';
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
