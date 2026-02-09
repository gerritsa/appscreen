const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Keep a global reference of the window object
let mainWindow;
let aboutWindow;
let preferencesWindow;

// Check if running in development mode
const isDev = process.argv.includes('--dev');

function showAboutWindow() {
    // If already open, focus it
    if (aboutWindow) {
        aboutWindow.focus();
        return;
    }

    aboutWindow = new BrowserWindow({
        width: 400,
        height: 380,
        resizable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        title: 'About yuzu.shot',
        backgroundColor: '#1a1a2e',
        show: false,
        parent: mainWindow,
        modal: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Load inline HTML for the about window
    const aboutHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #1a1a2e;
                color: #e0e0e0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                padding: 30px;
                text-align: center;
                -webkit-user-select: none;
                user-select: none;
            }
            .icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
                border-radius: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 16px;
            }
            .icon svg {
                width: 48px;
                height: 48px;
                fill: #667eea;
            }
            h1 {
                font-size: 22px;
                font-weight: 600;
                margin-bottom: 6px;
                color: #fff;
            }
            .version {
                font-size: 13px;
                color: #888;
                margin-bottom: 16px;
            }
            .description {
                font-size: 13px;
                color: #aaa;
                line-height: 1.5;
                margin-bottom: 12px;
            }
            .author {
                font-size: 12px;
                color: #888;
            }
            .license {
                font-size: 11px;
                color: #666;
                margin-top: 12px;
            }
            .links {
                margin-top: 8px;
            }
            a {
                color: #667eea;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="icon">
            <svg viewBox="0 0 100 100">
                <rect width="100" height="100" rx="20" fill="#667eea"/>
                <rect x="20" y="30" width="60" height="45" rx="5" fill="white"/>
                <circle cx="50" cy="20" r="5" fill="white"/>
            </svg>
        </div>
        <h1>yuzu.shot</h1>
        <div class="version">Version 1.0.0</div>
        <div class="description">
            A free tool for creating beautiful App Store screenshots with customizable backgrounds, text overlays, and device frames.
        </div>
        <div class="author">
            Created by <a href="https://yuzuhub.com/en" target="_blank">Stefan from yuzuhub.com</a>
        </div>
        <div class="license">
            This project is free and open source under the <a href="https://github.com/YUZU-Hub/appscreen/blob/main/LICENSE" target="_blank">MIT License</a>.
        </div>
        <div class="links">
            <a href="https://github.com/YUZU-Hub/appscreen" target="_blank">GitHub</a>
        </div>
    </body>
    </html>
    `;

    aboutWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(aboutHTML));

    aboutWindow.once('ready-to-show', () => {
        aboutWindow.show();
    });

    // Handle external links
    aboutWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    aboutWindow.on('closed', () => {
        aboutWindow = null;
    });
}

function showPreferencesWindow() {
    // If already open, focus it
    if (preferencesWindow) {
        preferencesWindow.focus();
        return;
    }

    preferencesWindow = new BrowserWindow({
        width: 500,
        height: 620,
        resizable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        title: 'Preferences',
        backgroundColor: '#1a1a2e',
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload-preferences.js')
        }
    });

    preferencesWindow.loadFile(path.join(__dirname, 'preferences.html'));

    preferencesWindow.once('ready-to-show', () => {
        preferencesWindow.show();
    });

    // Handle external links
    preferencesWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    preferencesWindow.on('closed', () => {
        preferencesWindow = null;
    });
}

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1024,
        minHeight: 700,
        title: 'yuzu.shot',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        backgroundColor: '#1a1a2e',
        show: false, // Don't show until ready
        titleBarStyle: 'hiddenInset', // macOS: hide title bar but keep traffic lights
        trafficLightPosition: { x: 15, y: 15 }
    });

    // Load the index.html of the app
    mainWindow.loadFile('index.html');

    // Show window when ready to prevent visual flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Open DevTools in development mode
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Emitted when the window is closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Create application menu
    createMenu();
}

function createMenu() {
    const isMac = process.platform === 'darwin';

    const template = [
        // App menu (macOS only)
        ...(isMac ? [{
            label: app.name,
            submenu: [
                {
                    label: 'About yuzu.shot',
                    click: () => showAboutWindow()
                },
                { type: 'separator' },
                {
                    label: 'Preferences...',
                    accelerator: 'CmdOrCtrl+,',
                    click: () => showPreferencesWindow()
                },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        // File menu
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Project',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('createProject()');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Import Screenshots...',
                    accelerator: 'CmdOrCtrl+O',
                    click: async () => {
                        const result = await dialog.showOpenDialog(mainWindow, {
                            properties: ['openFile', 'multiSelections'],
                            filters: [
                                { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }
                            ]
                        });
                        if (!result.canceled && result.filePaths.length > 0) {
                            // Read files and convert to data URLs, then pass to handleFiles
                            const fileDataPromises = result.filePaths.map(async (filePath) => {
                                const data = fs.readFileSync(filePath);
                                const ext = path.extname(filePath).toLowerCase();
                                const mimeTypes = {
                                    '.png': 'image/png',
                                    '.jpg': 'image/jpeg',
                                    '.jpeg': 'image/jpeg',
                                    '.gif': 'image/gif',
                                    '.webp': 'image/webp'
                                };
                                const mimeType = mimeTypes[ext] || 'image/png';
                                const base64 = data.toString('base64');
                                const dataUrl = `data:${mimeType};base64,${base64}`;
                                const name = path.basename(filePath);
                                return { dataUrl, name };
                            });
                            const filesData = await Promise.all(fileDataPromises);
                            mainWindow.webContents.executeJavaScript(`handleFilesFromElectron(${JSON.stringify(filesData)})`);
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Export Current',
                    accelerator: 'CmdOrCtrl+E',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('exportCurrent()');
                    }
                },
                {
                    label: 'Export All',
                    accelerator: 'CmdOrCtrl+Shift+E',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('exportAll()');
                    }
                },
                { type: 'separator' },
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        // Edit menu
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' }
            ]
        },
        // View menu
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        // Window menu
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ] : [
                    { role: 'close' }
                ])
            ]
        },
        // Help menu
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Documentation',
                    click: () => {
                        shell.openExternal('https://github.com/YUZU-Hub/appscreen');
                    }
                },
                {
                    label: 'Report Issue',
                    click: () => {
                        shell.openExternal('https://github.com/YUZU-Hub/appscreen/issues');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Visit yuzuhub.com',
                    click: () => {
                        shell.openExternal('https://yuzuhub.com/en');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    createWindow();

    // On macOS, re-create window when dock icon is clicked
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle file save dialog from renderer
ipcMain.handle('show-save-dialog', async (event, options) => {
    const result = await dialog.showSaveDialog(mainWindow, options);
    return result;
});

// Handle file open dialog from renderer
ipcMain.handle('show-open-dialog', async (event, options) => {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result;
});

// Handle settings communication between preferences window and main app
ipcMain.handle('get-settings', async () => {
    // Get settings from main window's localStorage via executeJavaScript
    // Uses llmProviders from llm.js for default model values
    try {
        const settings = await mainWindow.webContents.executeJavaScript(`
            JSON.stringify({
                provider: localStorage.getItem('aiProvider') || 'anthropic',
                anthropicKey: localStorage.getItem('anthropicApiKey') || '',
                openaiKey: localStorage.getItem('openaiApiKey') || '',
                googleKey: localStorage.getItem('googleApiKey') || '',
                anthropicModel: localStorage.getItem('anthropicModel') || llmProviders.anthropic.defaultModel,
                openaiModel: localStorage.getItem('openaiModel') || llmProviders.openai.defaultModel,
                googleModel: localStorage.getItem('googleModel') || llmProviders.google.defaultModel
            })
        `);
        return JSON.parse(settings);
    } catch (e) {
        // Fallback defaults if llmProviders not available
        return {
            provider: 'anthropic',
            anthropicKey: '',
            openaiKey: '',
            googleKey: '',
            anthropicModel: '',
            openaiModel: '',
            googleModel: ''
        };
    }
});

ipcMain.handle('save-settings', async (event, settings) => {
    // Save settings to main window's localStorage
    try {
        await mainWindow.webContents.executeJavaScript(`
            localStorage.setItem('aiProvider', '${settings.provider}');
            localStorage.setItem('anthropicApiKey', '${settings.anthropicKey}');
            localStorage.setItem('openaiApiKey', '${settings.openaiKey}');
            localStorage.setItem('googleApiKey', '${settings.googleKey}');
            localStorage.setItem('anthropicModel', '${settings.anthropicModel}');
            localStorage.setItem('openaiModel', '${settings.openaiModel}');
            localStorage.setItem('googleModel', '${settings.googleModel}');
            // Update the UI if settings modal functions exist
            if (typeof loadSettingsFromStorage === 'function') {
                loadSettingsFromStorage();
            }
        `);
        return { success: true };
    } catch (e) {
        return { success: false, error: e.message };
    }
});

// Get LLM providers config from main window's llm.js
ipcMain.handle('get-llm-providers', async () => {
    try {
        const providers = await mainWindow.webContents.executeJavaScript('JSON.stringify(llmProviders)');
        return JSON.parse(providers);
    } catch (e) {
        // Fallback if llmProviders is not available
        return null;
    }
});

// Helper to find latest screenshot directory
function findLatestScreenshotDir(baseDir) {
    if (!fs.existsSync(baseDir)) return null;

    const dirs = fs.readdirSync(baseDir).filter(file => {
        return fs.statSync(path.join(baseDir, file)).isDirectory();
    });

    if (dirs.length === 0) return null;

    // Sort by name (which includes timestamp) descending
    dirs.sort().reverse();
    return path.join(baseDir, dirs[0]);
}

// Get latest screenshots
ipcMain.handle('get-latest-screenshots', async (event, { platform = 'ios', language = 'en' }) => {
    try {
        // Assuming GeeLPee is a sibling of the current directory (screenshot-maker-dosio)
        // Adjust path if needed based on actual structure
        const baseScreenshotDir = path.resolve(__dirname, '..', '..', 'GeeLPee', 'Screenshots');
        
        console.log('Scanning for screenshots in:', baseScreenshotDir);

        if (!fs.existsSync(baseScreenshotDir)) {
            console.log('Screenshot directory not found');
            return { success: false, error: 'Screenshot directory not found' };
        }

        const latestRunDir = findLatestScreenshotDir(baseScreenshotDir);
        if (!latestRunDir) {
             return { success: false, error: 'No screenshot runs found' };
        }

        // Construct path: <latest-run>/<platform>/<language>
        const targetDir = path.join(latestRunDir, platform, language);
        
        console.log('Target screenshot directory:', targetDir);

        if (!fs.existsSync(targetDir)) {
             return { success: false, error: `Directory not found: ${targetDir}` };
        }

        // Read files
        const files = fs.readdirSync(targetDir).filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
        });

        const images = files.map(file => {
             const filePath = path.join(targetDir, file);
             const data = fs.readFileSync(filePath);
             const ext = path.extname(file).toLowerCase();
             const mimeTypes = {
                 '.png': 'image/png',
                 '.jpg': 'image/jpeg',
                 '.jpeg': 'image/jpeg',
                 '.webp': 'image/webp'
             };
             const mimeType = mimeTypes[ext] || 'image/png';
             const base64 = data.toString('base64');
             return {
                 name: file,
                 dataUrl: `data:${mimeType};base64,${base64}`
             };
        });

        return { success: true, images, sourcePath: targetDir };

    } catch (error) {
        console.error('Error getting screenshots:', error);
        return { success: false, error: error.message };
    }
});

// Scan for ALL available screenshots
ipcMain.handle('scan-for-screenshots', async (event) => {
    try {
        const baseScreenshotDir = path.resolve(__dirname, '..', '..', 'GeeLPee', 'Screenshots');
        
        if (!fs.existsSync(baseScreenshotDir)) {
            return { success: false, found: false, count: 0 };
        }

        const latestRunDir = findLatestScreenshotDir(baseScreenshotDir);
        if (!latestRunDir) {
             return { success: false, found: false, count: 0 };
        }

        const platforms = {};
        const availablePlatforms = ['ios', 'android']; // Known platforms, but we can scan directory too
        
        // Scan for platforms
        const entries = fs.readdirSync(latestRunDir, { withFileTypes: true });
        
        for (const entry of entries) {
            if (entry.isDirectory()) {
                const platform = entry.name.toLowerCase();
                // Check if it's a valid platform folder or just any folder? 
                // Let's assume any folder at this level is a platform
                
                const platformDir = path.join(latestRunDir, entry.name);
                const langEntries = fs.readdirSync(platformDir, { withFileTypes: true });
                
                const languages = [];
                for (const langEntry of langEntries) {
                    if (langEntry.isDirectory()) {
                        // verify it has images
                        const langDir = path.join(platformDir, langEntry.name);
                        const hasImages = fs.readdirSync(langDir).some(f => {
                            const ext = path.extname(f).toLowerCase();
                            return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
                        });
                        
                        if (hasImages) {
                            languages.push(langEntry.name);
                        }
                    }
                }
                
                if (languages.length > 0) {
                    platforms[platform] = languages;
                }
            }
        }
        
        const totalPlatforms = Object.keys(platforms).length;
        const totalLanguages = Object.values(platforms).reduce((acc, curr) => acc + curr.length, 0);

        const timestamp = path.basename(latestRunDir);

        return { 
            success: true, 
            found: totalPlatforms > 0, 
            platforms: platforms, 
            timestamp: timestamp,
            basePath: latestRunDir 
        };

    } catch (error) {
        console.error('Error scanning screenshots:', error);
        return { success: false, error: error.message };
    }
});

// Get config file
ipcMain.handle('get-config', async () => {
    try {
        const configPath = path.join(process.cwd(), 'dosio.config.json');
        if (fs.existsSync(configPath)) {
            const configData = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(configData);
        }
        return null;
    } catch (error) {
        console.error('Error reading config:', error);
        return null;
    }
});
