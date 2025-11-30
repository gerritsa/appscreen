# App Store Screenshot Generator

A free, open-source tool for creating beautiful App Store screenshots with customizable backgrounds, text overlays, and device frames.

![App Store Screenshot Generator](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- **Multiple Output Sizes**: Support for iPhone 6.9", 6.7", 6.5", 5.5" and iPad 12.9", 11" App Store requirements, plus custom sizes
- **Customizable Backgrounds**: Gradient, solid color, or image backgrounds with blur and overlay options
- **Text Overlays**: Add headlines and subheadlines with customizable fonts, sizes, colors, and positioning
- **Multi-Language Support**: Add translations for multiple languages and switch between them
- **AI-Powered Translations**: Automatically translate your marketing copy using Claude AI
- **Device Frames**: Optional device frames with various iPhone and iPad styles
- **Screenshot Positioning**: Multiple preset positions (centered, bleed, tilt, perspective) or manual control
- **Shadow Effects**: Customizable drop shadows for screenshots
- **Noise Overlay**: Add subtle noise texture to backgrounds
- **Project Management**: Save and manage multiple projects
- **Batch Export**: Export all screenshots at once

## Getting Started

### Option 1: Run Locally

Since this app uses IndexedDB for persistence, you need to serve it through a local web server:

```bash
# Using Python
cd appscreen
python3 -m http.server 8000

# Using Node.js
npx serve .
```

Then open `http://localhost:8000` in your browser.

### Option 2: VS Code Live Server

If you have the "Live Server" extension installed in VS Code, right-click `index.html` and select "Open with Live Server".

## Usage

1. **Upload Screenshots**: Drag and drop your app screenshots or click to browse
2. **Choose Output Size**: Select the target device size from the sidebar
3. **Customize Background**: Choose gradient, solid color, or image background
4. **Position Screenshot**: Use presets or manually adjust scale, position, and rotation
5. **Add Text**: Enter your headline and optional subheadline
6. **Export**: Download the current screenshot or export all at once

## AI Translation

To use the AI-powered translation feature:

1. Click the Settings icon (gear) in the sidebar
2. Enter your Claude API key from [Anthropic Console](https://console.anthropic.com/settings/keys)
3. Add multiple languages to your headline/subheadline
4. Click the translate icon and use "Auto-translate with AI"

Your API key is stored locally in your browser and only sent to Anthropic's API.

## Tech Stack

- Vanilla JavaScript (no frameworks)
- HTML5 Canvas for rendering
- Three.js for 3D device mockups
- IndexedDB for local storage
- Claude API for translations

## Apps Using This Project

Built something with this tool? Add your app to the list by submitting a pull request!

| App | Description | Link |    
|-----|-------------|------|
| Cable | Manage your 12V systems like Boats and RVs | [cable.yuzuhub.com](https://cable.yuzuhub.com) |
| Eno | Wine pairings and food pairings made easy | [eno.yuzuhub.com](https://eno.yuzuhub.com) |
| *Your app here* | *Submit a PR to add your app* | *Your app link* |

## License

MIT License - feel free to use, modify, and distribute.

## Credits

- **iPhone 15 Pro Max 3D Model** by [MajdyModels](https://sketchfab.com/majdymodels) - Licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## Author

Proudly vibe coded by [Stefan from yuzuhub.com](https://yuzuhub.com)
