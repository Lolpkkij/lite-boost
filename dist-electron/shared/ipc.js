"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHANNELS = void 0;
// IPC Channel Names
exports.CHANNELS = {
    // Memory channels
    MEMORY_INFO: 'memory:info',
    MEMORY_TRIM: 'memory:trim',
    MEMORY_CLEAN: 'memory:clean',
    // Process channels
    PROCESS_LIST: 'process:list',
    CPU_INFO: 'cpu:info',
    // GPU channels
    GPU_INFO: 'gpu:info',
    // System windows
    WINDOW_SET_BOUNDS: 'window:set-bounds',
    WINDOW_SET_MINIMIZED: 'window:set-minimized',
    WINDOW_SET_MAXIMIZED: 'window:set-maximized',
    WINDOW_IS_MINIMIZED: 'window:is-minimized',
};
//# sourceMappingURL=ipc.js.map