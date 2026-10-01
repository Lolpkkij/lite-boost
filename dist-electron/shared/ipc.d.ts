export declare const CHANNELS: {
    readonly MEMORY_INFO: "memory:info";
    readonly MEMORY_TRIM: "memory:trim";
    readonly MEMORY_CLEAN: "memory:clean";
    readonly PROCESS_LIST: "process:list";
    readonly CPU_INFO: "cpu:info";
    readonly GPU_INFO: "gpu:info";
    readonly WINDOW_SET_BOUNDS: "window:set-bounds";
    readonly WINDOW_SET_MINIMIZED: "window:set-minimized";
    readonly WINDOW_SET_MAXIMIZED: "window:set-maximized";
    readonly WINDOW_IS_MINIMIZED: "window:is-minimized";
};
export type MemoryInfo = {
    totalBytes: number;
    availableBytes: number;
    usedBytes: number;
    usedPercentage: number;
    freePercentage: number;
};
export type CPUInfo = {
    loadPercentage: number;
    processCount: number;
};
export type GPUInfo = {
    loadPercentage: number;
    dedicatedUsage: number;
    totalUsage: number;
    gpuType?: string;
};
export type IPCResponse<T = void> = T extends void ? void : T extends Promise<infer R> ? R : T;
export type IPCInvokeParams = {
    channel: typeof CHANNELS[keyof typeof CHANNELS];
    params?: unknown;
};
export type IPCListenerParams = {
    channel: typeof CHANNELS[keyof typeof CHANNELS];
    listener: (unknown: any) => void;
};
