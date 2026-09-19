# Interactive Post Scheduling Calendar with Performance Optimization and Testing

## Aim
To design and implement an interactive calendar interface for scheduling and managing posts while optimizing rendering performance and implementing testing strategies for interactive UI components.

## Objectives
- Understand time-based data visualization.
- Implement calendar-based scheduling.
- Map structured post data to temporal layouts.
- Enable click, drag-and-drop and resize interactions.
- Identify UI performance bottlenecks.
- Apply React.memo, useMemo and useCallback.
- Reduce unnecessary re-renders.
- Implement component and interaction tests.

## CO Mapping
- CO3 - BT3
- CO4 - BT4
- CO5 - BT5

## Prerequisites
React.js, JavaScript, React hooks, basic Redux, date/time handling and basic testing knowledge.

## Software Requirements
React.js, FullCalendar, Redux Toolkit, Vitest, React Testing Library, Browser DevTools and VS Code.

## Features
- Month, week and day calendar views.
- Create, edit and delete posts.
- Drag-and-drop rescheduling.
- Event resizing.
- Platform and status filtering.
- Dashboard statistics.
- Redux Toolkit state management.
- React performance optimizations.
- Automated tests.

## Theory

### Temporal Data Modeling
Temporal data describes information related to time: date, start time, end time and duration.

### Event Mapping
Structured post objects are converted into FullCalendar event objects and displayed at the matching date/time.

### User Interaction
The interface supports click, selection, drag-and-drop and resize operations.

### Performance Optimization
`React.memo` can skip rendering a memoized component when its props are unchanged. `useMemo` caches calculated values, while `useCallback` caches function references. These techniques should be used selectively where they reduce meaningful work.

### Testing
Testing checks that components and logic behave correctly. This project uses Vitest and React Testing Library for rendering, form validation, filtering and user interactions.

### HCI and Information Visualization
Calendar interfaces are examples of Human-Computer Interaction and Information Visualization because time-based information is represented visually for intuitive interaction.

## Data Flow
Post Data -> Redux State -> Filtering/Sorting -> Memoized Calendar Events -> Calendar -> User Interaction -> State Update -> Optimized Re-render

## Flowchart
START
↓
Create React Application
↓
Create Post Data
↓
Initialize State
↓
Map Posts to Calendar Events
↓
Display Calendar
↓
User Interaction
↓
Click / Drag / Resize / Create
↓
Update State
↓
Memoized Calculations
↓
Optimized Re-render
↓
Run Tests
↓
PASS?
YES -> Finish
NO -> Fix Issue -> Retest

## Installation

```bash
npm install
```

## Run

```bash
npm run dev
```

Open the local Vite URL shown in the terminal.

## Run Tests

```bash
npm test
```

## Build

```bash
npm run build
```

## Project Structure

```text
src/
├── components/
│   ├── CalendarView.jsx
│   ├── DashboardStats.jsx
│   ├── FilterBar.jsx
│   ├── PerformancePanel.jsx
│   ├── PostForm.jsx
│   ├── PostList.jsx
│   └── PostModal.jsx
├── data/
│   └── samplePosts.js
├── store/
│   ├── postsSlice.js
│   └── store.js
├── tests/
│   ├── DashboardStats.test.jsx
│   ├── FilterBar.test.jsx
│   ├── PostForm.test.jsx
│   └── setup.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## Expected Outcome
A functional, responsive calendar scheduling application with interactive post management, optimized React rendering and automated tests.

## Conclusion
The experiment demonstrates how React, FullCalendar, Redux Toolkit, memoization and testing can be integrated to build a reliable, efficient and interactive scheduling system.

## Viva Questions
1. **What is temporal data?** Data associated with time such as date, start time and duration.
2. **What is event mapping?** Converting structured application data into calendar events.
3. **What is React.memo?** A component optimization technique that can skip rendering when props are unchanged.
4. **What is useMemo?** A hook that caches the result of a calculation.
5. **What is useCallback?** A hook that caches a function reference.
6. **Why use Redux?** To maintain centralized application state.
7. **What is drag-and-drop scheduling?** Moving an event to change its scheduled date/time.
8. **What is unit testing?** Testing a small, focused piece of functionality.
9. **What is interaction testing?** Testing user actions and their resulting behavior.
10. **Why is performance optimization important?** It reduces unnecessary work and improves responsiveness.
