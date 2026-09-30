// IPC Channel Names
export const CHANNELS = {
  // Memory channels
  MEMORY_INFO: 'memory:info',
  MEMORY_TRIM: 'memory:trim',

  // CPU channels
  CPU_INFO: 'cpu:info',

  // GPU channels
  GPU_INFO: 'gpu:info',

  // System windows
  WINDOW_SET_BOUNDS: 'window:set-bounds',
  WINDOW_SET_MINIMIZED: 'window:set-minimized',
  WINDOW_SET_MAXIMIZED: 'window:set-maximized',
  WINDOW_IS_MINIMIZED: 'window:is-minimized',
} as const;

// IPC Payload Types
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
  listener: (unknown) => void;
};