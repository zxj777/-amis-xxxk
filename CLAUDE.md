# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (runs on port 3000)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Architecture Overview

This is a **completely schema-driven application** using amis (low-code frontend framework) with React and Vite. The key architectural principle is that **all UI components, layouts, and behaviors are defined in JSON configuration files** rather than hardcoded React components.

### Core Architecture

1. **Schema-First Design**: The entire application is rendered from JSON schemas fetched dynamically
2. **Minimal React Layer**: `App.jsx` serves only as a schema renderer with a custom fetcher
3. **JSON-Driven Everything**: Pages, components, interactions, and state management are all defined in JSON

### Key Files and Their Roles

- **`src/App.jsx`**: Minimal React wrapper that fetches `/api/page-config.json` and renders it via amis
- **`public/api/page-config.json`**: Main page schema defining the entire application structure
- **`public/api/detail-schema.json`**: Reusable detail component schema loaded via `schemaApi`
- **`public/api/user-detail-*.json`**: User-specific data (not schemas, just data)

### Data Flow

1. App loads and fetches `page-config.json` containing the complete page schema
2. Page schema includes a CRUD table and a conditional detail service component
3. Clicking "查看详情" uses `setValue` action to update page-level state (`selectedUserId`, `showDetail`)
4. Detail service component becomes visible and dynamically loads:
   - Schema via `schemaApi: "/api/detail-schema.json"`
   - Data via `api: "/api/user-detail-${selectedUserId}.json"`

### State Management

State is managed entirely within amis using:
- **Page-level data**: `selectedUserId` and `showDetail` stored in page's `data` property
- **setValue actions**: Update state via button clicks
- **Conditional rendering**: Components use `visibleOn` expressions to show/hide
- **Template variables**: `${selectedUserId}` for dynamic API URLs

### Schema Structure Patterns

- **Service components**: Use both `schemaApi` (for component structure) and `api` (for data)
- **Dynamic APIs**: Use template variables like `/api/user-detail-${selectedUserId}.json`
- **Actions**: Use `actionType: "setValue"` with empty `componentId: ""` to update page data
- **Conditional visibility**: Use `visibleOn: "${condition}"` expressions

### Development Notes

- **No hardcoded components**: All UI is defined in JSON schemas
- **Custom fetcher**: App.jsx provides a fetcher function for amis API calls
- **ESM modules**: Project uses `"type": "module"` in package.json
- **Hot reload**: Vite provides fast development experience
- **Mock APIs**: All APIs are static JSON files in `public/api/`

### Debugging

The current page-config includes a debug panel showing state values. To debug schema issues:
- Check browser console for amis warnings
- Verify JSON syntax in schema files
- Use the debug panel to monitor state changes
- Check Network tab for failed API requests