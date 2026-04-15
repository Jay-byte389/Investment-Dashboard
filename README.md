
# Investment-Dashboard
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
=======
# InvestorVault — Interactive Fintech Dashboard
>>>>>>> 0550c7b (initial commit)

Welcome to **InvestorVault**, a high-performance, scalable Next.js project designed for institutional investors and corporate entities. This dashboard provides real-time (simulated) insights into investment deals, portfolio health, and market trends.

## 🚀 Technology Stack
- **Next.js (latest App Router)**: Leveraging the latest features for routing, performance, and React Server Components.
- **Redux Toolkit**: Centralized state management for deals, investor profiles, and UI state.
- **TypeScript**: Ensuring type safety across the entire application.
- **Tailwind CSS**: Modern utility-first CSS for a premium, responsive design.
- **Recharts**: High-performance data visualization for financial metrics.
- **Framer Motion**: Smooth animations and transitions for a premium feel.

## 🏗️ Architecture
The project follows a modular and scalable architecture:
- `/app`: Contains all pages and layouts according to the Next.js App Router pattern.
- `/components`: Reusable UI components (StatCards, DealCards, FilterBars, etc.).
- `/services`: Frontend service layer that simulates backend behavior (async promises, latency, filtering, and sorting).
- `/store`: Redux slices and the global store configuration.
- `/utils`: Pure utility functions for formatting, scoring, and calculations.
- `/data`: Local JSON files serving as the project's data source.

## 📊 Data Mapping & Flow
1. **Data Layer**: `deals.json` and `investors.json` hold the raw data.
2. **Service Layer**: `dealService.ts` and `investorService.ts` fetch data, applying logic for:
   - Pagination (limit/offset)
   - Multi-field filtering (ROI, risk, industry, investment range)
   - Sorting (newest, ROI, investment amount)
   - Latency simulation (300ms–800ms)
3. **State Management**: Redux thunks call services and store results. UI components listen to Redux state.
4. **Recommendation Engine**: A scoring algorithm (`scoring.ts`) matches deals to investor preferences based on risk, industry, budget, and ROI.

## ⚡ Performance Optimization
- **Memoization**: `useMemo` and `useCallback` are used extensively to optimize heavy calculations (like scoring) and prevent unnecessary re-renders.
- **Debounced Search**: Search inputs are debounced to prevent redundant service calls during typing.
- **Lazy Loading**: Heavy chart components are dynamically imported to reduce the initial bundle size.
- **Persistence**: Saved deals are persisted in `localStorage` via a dedicated Redux slice.

## 🌗 Features
- **Investor Dashboard**: High-level metrics with aggregate growth and risk charts.
- **Deal Explorer**: Search and filter through 100+ deals with multiple parameters.
- **Deal Details**: Deep dive into specific deals with financial projections and risk profiles.
- **Corporate View**: Platform-wide metrics for corporate oversight.






