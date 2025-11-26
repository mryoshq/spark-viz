# Spark Visualizers - Unified Application

A comprehensive, unified web application that combines three Apache Spark visualizers into a single interactive platform for visual learners.

## Features

- **Welcome Page**: Central hub with navigation to all visualizers
- **Core Internals Visualizer**: Demonstrates data partitioning, task distribution, and memory management
- **Internals Visualizer**: Step-by-step execution flow of Spark jobs
- **Lakehouse Visualizer**: Modern Data Lakehouse architecture layers

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **React Router** for navigation
- **Tailwind CSS** (CDN) for styling
- **Framer Motion** for animations
- **Lucide React** for icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Application will be available at `http://localhost:3000/`

### Production Build

```bash
npm run build
```

Build files will be in the `dist/` directory

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
spark-visualizers-unified/
├── src/
│   ├── pages/           # Page components
│   ├── components/      # Shared and feature-specific components
│   ├── constants/       # Configuration constants
│   ├── types/          # TypeScript type definitions
│   └── App.tsx         # Main app with routing
├── index.html
├── styles.css          # Global styles
└── package.json
```

## Routes

- `/` - Welcome page
- `/core-internals` - Core Internals Visualizer
- `/internals` - Spark Internals Visualizer
- `/lakehouse` - Lakehouse Architecture Visualizer

## License

MIT
