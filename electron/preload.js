const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Check if running in Electron
    isElectron: true,

    // Platform info
    platform: process.platform,

    // Show native save dialog
    showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),

    // Show native open dialog
    showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),

    // Get latest screenshots
    getLatestScreenshots: (options) => ipcRenderer.invoke('get-latest-screenshots', options),

    // Scan for screenshots
    scanForScreenshots: (options) => ipcRenderer.invoke('scan-for-screenshots', options),

    // Get config
    getConfig: () => ipcRenderer.invoke('get-config')
});
