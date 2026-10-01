"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dismissToast = exports.showLoading = exports.showError = exports.showSuccess = void 0;
const sonner_1 = require("sonner");
const showSuccess = (message) => {
    sonner_1.toast.success(message);
};
exports.showSuccess = showSuccess;
const showError = (message) => {
    sonner_1.toast.error(message);
};
exports.showError = showError;
const showLoading = (message) => {
    return sonner_1.toast.loading(message);
};
exports.showLoading = showLoading;
const dismissToast = (toastId) => {
    sonner_1.toast.dismiss(toastId);
};
exports.dismissToast = dismissToast;
//# sourceMappingURL=toast.js.map