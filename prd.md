# Product Requirements Document (PRD)

# Smart CityOS - Interactive Digital Twin Dashboard

Version: 1.0

Platform: Web Application

Framework: React.js

Language: TypeScript

Build Tool: Vite

Status: Draft

---

# 1. Problem Statement

Modern city management systems often present operational data in traditional tables and static dashboards, making it difficult for users to quickly understand the real-time condition of buildings and infrastructure.

Facility managers, operators, and decision makers require an intuitive visualization platform capable of displaying city assets in an interactive 3D environment while providing instant access to operational information such as electricity consumption, water supply, occupancy, HVAC efficiency, infrastructure health, and alerts.

The objective of this project is to build a modern Smart City Digital Twin Dashboard that combines a high-quality 3D city visualization with an enterprise-grade analytics dashboard, allowing users to interact directly with buildings and monitor infrastructure in an immersive way.

This project is frontend-only and will use dummy/static data without any backend integration.

---

# 2. Goals

## Primary Goals

- Build a premium Smart City dashboard similar to the provided reference.
- Provide an immersive 3D visualization of city buildings.
- Allow users to interact with individual buildings.
- Display operational information using floating glassmorphism panels.
- Deliver a smooth and modern user experience.
- Demonstrate enterprise-level frontend architecture using React.

---

## Secondary Goals

- Practice React Three Fiber.
- Demonstrate advanced UI/UX implementation.
- Showcase modern frontend engineering.
- Easily extendable for future backend integration.

---

# 3. Target Users

## Primary Users

### Facility Manager

Monitor building health.

### Building Operator

Observe electricity, HVAC, occupancy, and water systems.

### Smart City Administrator

Manage multiple buildings across the city.

### Demonstration / Portfolio Viewer

Experience a realistic Smart City Digital Twin.

---

# 4. User Stories

### Dashboard

As a user,

I want to see the entire city in one screen,

so I can understand the city status instantly.

---

### Building Selection

As a user,

I want to click any building,

so I can inspect detailed information.

---

### Building Highlight

As a user,

I want the selected building to glow blue,

so I know which building is currently selected.

---

### Information Panel

As a user,

I want detailed information to appear beside the selected building,

so I can inspect operational metrics.

---

### Infrastructure Monitoring

As a user,

I want to view electricity, HVAC, water supply, occupancy and safety information,

so I can evaluate building performance.

---

### Analytics

As a user,

I want charts and statistics,

so I can understand historical usage.

---

### Navigation

As a user,

I want smooth camera movement,

so interacting with the city feels natural.

---

# 5. Functional Requirements

## 5.1 Navigation

- Top Navigation Bar
- Company Logo
- Search Button
- Notification Button
- User Avatar

---

## 5.2 3D City Scene

The dashboard shall display:

- Complete 3D city
- Roads
- Buildings
- Shadows
- Lighting
- Camera controls

---

## 5.3 Interactive Buildings

Every building shall be clickable.

When clicked:

- Previous selection disappears
- Current building becomes selected
- Blue glow animation appears
- Information panel updates

---

## 5.4 Building Highlight

Selected building shall have:

- Blue outline
- Bloom effect
- Slight emissive material
- Smooth transition animation

Exactly like the provided design reference.

---

## 5.5 Floating Information Card

Appears after selecting a building.

Contains:

### General Information

- Building Name
- Asset ID
- Building Type
- Status
- Operational Since

---

### Occupancy

- Total Area
- Occupancy
- Tenants

---

### Electricity

- Current Consumption
- Peak Today
- Average Load

---

### Water Supply

- Water Pressure
- Daily Usage

---

### HVAC

- Efficiency
- Temperature

---

### Fire Safety

- Health Percentage

---

### Infrastructure Health

Progress bars for

- HVAC
- Water
- Fire Safety
- Electricity

---

### Alerts

Display dummy alerts.

Example:

High electricity usage detected.

---

## 5.6 Analytics Widgets

Display:

Line Chart

- Electricity Usage

Bar Chart

- Daily Consumption

Pie Chart

- Load Distribution

Area Chart

- Water Usage

All data uses dummy values.

---

## 5.7 Mini Map

Bottom-left mini map.

Display:

- City overview
- Selected building marker

(No real GIS integration.)

---

## 5.8 Export Button

Dummy action.

Displays toast:

"Export started."

---

## 5.9 Manage Asset Button

Dummy modal.

---

## 5.10 Dashboard Cards

Dashboard includes:

Building Occupancy

Infrastructure Health

Load Distribution

Electric Usage

Alerts

Water Supply

HVAC Efficiency

---

## 5.11 Animations

All interactions shall include smooth animations.

Including:

Hover

Selection

Panel appearance

Camera transition

Chart loading

Button hover

Card hover

---

# 6. Non-Functional Requirements

## Performance

- Initial load under 3 seconds
- Maintain 60 FPS during interaction
- Optimize rendering
- Lazy load 3D assets

---

## Responsiveness

Desktop First.

Supports:

1920x1080

1600x900

1440x900

1366x768

Tablet support optional.

---

## Accessibility

- Keyboard navigation
- Visible focus state
- Sufficient color contrast

---

## Maintainability

Component-based architecture.

Reusable components.

Modular folder structure.

---

## Scalability

Project should support future:

- Backend integration
- Live IoT data
- Authentication
- GIS
- Real-time WebSocket

without major refactoring.

---

## Code Quality

- TypeScript
- ESLint
- Prettier
- Clean Architecture
- Reusable Hooks

---

# 7. Design Requirements

The UI **must match the provided reference image as closely as possible**.

No simplification is allowed.

The following visual elements are mandatory:

---

## Background

Soft white/gray city environment.

Background Color:

```

#EEF3F8

```

Secondary background:

```

#F5F7FA

```

---

## Primary Color

```

#3B82F6

```

---

## Secondary Color

```

#60A5FA

```

---

## Accent Glow

```

#00D8FF

```

---

## Success

```

#34D399

```

---

## Warning

```

#F59E0B

```

---

## Danger

```

#EF4444

```

---

## Text

Primary

```

#111827

```

Secondary

```

#6B7280

```

---

## Card Style

Glassmorphism.

Requirements:

- backdrop blur
- translucent white
- soft shadow
- rounded corners
- subtle border

CSS reference:

```

background: rgba(255,255,255,.72);

backdrop-filter: blur(20px);

border: 1px solid rgba(255,255,255,.35);

box-shadow: 0 20px 60px rgba(15,23,42,.12);

border-radius: 24px;

```

---

## Animation

Use smooth easing.

Duration

200–500 ms

No abrupt transitions.

---

## Building Glow

Selected building must have:

- Blue emissive material
- Bloom effect
- Animated pulse
- Outer glow
- Slight transparency

Exactly matching the reference.

---

## Charts

Rounded.

Minimal.

Blue gradient.

No unnecessary grid lines.

---

## Typography

Font:

Poppins

Weights:

400

500

600

700

---

## Icons

Lucide Icons

---

# 8. Dummy Data

All dashboard values use static JSON.

Example:

- Electricity
- Water
- Occupancy
- Alerts
- Load Distribution

No API.

No Backend.

No Database.

---

# 9. Recommended Tech Stack

## Framework

- React.js
- TypeScript
- Vite

---

## Styling

- Tailwind CSS
- tailwindcss-animate
- clsx
- tailwind-merge

---

## 3D Rendering

- Three.js
- @react-three/fiber
- @react-three/drei
- @react-three/postprocessing

---

## Effects

- postprocessing
- Bloom
- Outline
- SSAO
- Environment
- Contact Shadows

---

## Charts

- Apache ECharts
- echarts-for-react

---

## Animation

- Framer Motion

---

## Icons

- Lucide React

---

## Routing

- React Router DOM

---

## State Management

- Zustand

---

## Notifications

- Sonner

---

## Utilities

- React Query (for future scalability, even if not connected to an API)
- Axios (reserved for future use)

---

## Model Loading

- GLTF Loader
- DRACO Loader

---

## Development Tools

- ESLint
- Prettier
- Husky
- Lint Staged

---

# 10. Folder Structure

```
src/
│
├── assets/
│
├── components/
│   ├── navbar/
│   ├── sidebar/
│   ├── cards/
│   ├── charts/
│   ├── minimap/
│   ├── building/
│   ├── panels/
│   ├── ui/
│
├── features/
│   ├── dashboard/
│   ├── city/
│
├── hooks/
│
├── layouts/
│
├── pages/
│
├── scene/
│   ├── CityScene.tsx
│   ├── Building.tsx
│   ├── Lights.tsx
│   ├── Effects.tsx
│
├── store/
│
├── types/
│
├── utils/
│
├── data/
│   ├── buildings.json
│   ├── analytics.json
│
├── App.tsx
│
└── main.tsx
```

---

# 11. Project Scope

## Included

- Interactive 3D city
- Building selection
- Blue building highlight
- Glassmorphism dashboard
- Floating information panels
- Dummy analytics
- Animated charts
- Mini map
- Responsive desktop layout
- Smooth camera interaction
- Modern UI/UX
- Fully componentized React application
- Static JSON data
- Premium visual quality closely matching the provided reference

# 7D. Interactive Experience Requirements

The application should feel like a premium Smart City Digital Twin platform rather than a static dashboard.

## Building Interaction

Every building must be independently interactive.

### Hover

When hovering over a building:

- Building slightly brightens
- Cursor changes to pointer
- Soft blue outline appears
- Building smoothly scales to 101%
- Tooltip appears above the building

Tooltip displays:

- Building Name
- Current Status
- Electricity Usage
- Occupancy

The tooltip disappears smoothly when the cursor leaves.

---

### Selection

When clicking a building:

- Previous building is deselected
- Camera smoothly moves toward the selected building
- Blue bloom animation starts
- Outline animation appears
- Building glows continuously
- Information panel slides into view
- Charts animate to new values
- Dashboard metrics count up to new values
- Mini map updates marker
- Building label appears above the roof

Only one building may be selected at a time.

---

### Double Click

Double-clicking a building enters Focus Mode.

Focus Mode:

- Camera zooms closer
- Other buildings become slightly transparent
- Selected building remains highlighted
- More detailed information is displayed

Double-click again returns to normal view.

---

### Right Click

Right-click opens a contextual action menu.

Menu options:

- View Details
- Show Analytics
- Highlight Infrastructure
- Close

These actions are frontend-only.

---

## Camera Interaction

Camera movement should feel cinematic.

Requirements:

- Smooth damping
- Inertia
- Soft transitions
- Prevent clipping
- Prevent moving below ground
- Auto-focus selected building
- Smooth reset animation

---

## Dashboard Animation

Every widget should animate naturally.

Examples:

Cards

- Fade in
- Slide upward
- Soft blur transition

Charts

- Animate values
- Smooth line drawing
- Animated bars
- Pie rotation animation

Numbers

- Count up animation

Progress Bars

- Animate width

Alerts

- Pulse animation

---

## Live Dashboard Simulation

Although using dummy data, simulate real-time monitoring.

Every 5–10 seconds randomly update:

- Electricity
- Water Supply
- HVAC
- Occupancy
- Alerts

Animations should smoothly transition values.

Users should feel like monitoring a live system.

---

## Environmental Animation

The city should never appear static.

Include:

- Moving clouds
- Slowly changing sunlight
- Floating particles
- Animated glow
- Soft ambient movement
- Dynamic shadows

---

## Smart Notifications

Randomly generate notifications.

Examples:

⚡ High electricity usage

💧 Water pressure drop

🔥 Fire system inspection complete

🏢 Occupancy increased

Notification cards slide in and disappear automatically.

---

## Building Status

Every building has a status.

Available statuses:

- Normal
- Warning
- Critical
- Maintenance

Visual indicators:

Normal

Green

Warning

Orange

Critical

Red

Maintenance

Blue

Status colors update dynamically.

---

## Infrastructure Layers

Toolbar allows toggling visualization layers.

Available layers:

- Electricity
- Water
- HVAC
- Occupancy
- Fire Safety
- Internet
- Solar Panels

Each layer changes the city visualization.

Example:

Electricity

Blue animated lines between buildings.

Water

Cyan flowing pipes.

HVAC

Airflow animation.

Occupancy

Heatmap.

Fire Safety

Red safety indicators.

---

## Day/Night Mode

Toggle between:

Day

Night

Night mode includes:

- Building lights
- Street lights
- Blue ambient lighting
- Stronger bloom
- Dark glass panels

Transition should animate over approximately one second.

---

## Search

Search buildings instantly.

Typing filters buildings.

Selecting a result automatically:

- Moves camera
- Selects building
- Opens dashboard

---

## Minimap

Interactive minimap.

Users can:

- Click buildings
- Drag minimap
- Zoom minimap

Selection syncs with the 3D city.

---

## Keyboard Shortcuts

F

Focus selected building

ESC

Exit focus mode

R

Reset camera

M

Toggle minimap

N

Toggle notifications

L

Toggle infrastructure layers

---

## Loading Experience

Application startup should include:

Animated splash logo

Loading progress bar

3D city fade-in

Glass panels fade-in

Camera fly-through animation

Then transition to dashboard.

---

## Sound (Optional)

Soft UI sounds:

Hover

Click

Notification

Panel opening

Building selection

Muted by default.

---

## Easter Eggs

Hidden interactions:

Click the logo five times:

Enable Developer Mode.

Developer Mode displays:

- FPS
- Triangle count
- Draw calls
- Memory usage
- Camera coordinates
- Selected Building ID
---

## Excluded

- Backend/API integration
- Authentication/Login
- User management
- Database
- GIS integration
- IoT device integration
- Real-time sensor data
- WebSocket communication
- CRUD functionality
- Asset editing and persistence
- File export implementation (UI only)
- Map routing and navigation
- Mobile-first optimization