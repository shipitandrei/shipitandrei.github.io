# Would You Press The Button?

An interactive decision-making game that explores the consequences of choices through a series of hypothetical scenarios. Available as a Progressive Web App (PWA) for seamless access across devices.

## Overview

This project presents users with thought-provoking "would you" scenarios, each with compelling benefits and unexpected drawbacks. Built with modern web technologies, it demonstrates effective PWA implementation with offline capabilities and responsive design.

## Features

- **Progressive Web App (PWA)** - Installable on mobile and desktop platforms
- **Offline Functionality** - Service Worker enables full gameplay without internet
- **Responsive Interface** - Optimized for mobile-first experience
- **Performance Optimized** - Lightweight architecture with fast load times
- **50+ Unique Scenarios** - Varied decision-making challenges with randomized selection

## Getting Started

### Play Online
Visit the application at: [shipitandrei.github.io](https://shipitandrei.github.io)

### Install as App
The application can be installed as a standalone app on supported platforms:
- **Android (Chrome)**: Tap the menu icon → "Install app" or "Add to Home Screen"
- **iOS (Safari)**: Tap Share → "Add to Home Screen"
- **Desktop (Chrome/Edge)**: Click the install icon in the address bar

## How to Play

1. Review the presented scenario with its potential benefits and consequences
2. Make your decision to press or decline
3. Progress through 10 rounds of increasingly interesting scenarios
4. Track your choices throughout the game

## Technology Stack

| Technology | Purpose |
|-----------|---------|
| HTML5 | Semantic markup |
| CSS3 | Responsive styling |
| JavaScript (ES6+) | Game logic and interactivity |
| Service Worker | Offline support and caching |
| Web App Manifest | PWA configuration |

## Architecture

```
├── index.html              # Landing page
├── app.html               # Main game interface
├── appscript.js           # Core game logic
├── script.js              # PWA installation handler
├── style.css              # Game styling
├── service-worker.js      # Offline caching strategy
├── manifest.json          # PWA metadata
└── images/                # App icons and assets
```

## PWA Implementation

The Service Worker caches critical resources for offline access, ensuring the game remains playable even without internet connectivity. The Web App Manifest defines the installation behavior and appearance on home screens.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+ (iOS/macOS)
- Samsung Internet 14+

## License

Open source - available on [GitHub](https://github.com/shipitandrei/shipitandrei.github.io)