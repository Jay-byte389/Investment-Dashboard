
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
- **Dark Mode**: Fully supported premium dark theme togglable via the navigation bar.

## 🛠️ Getting Started
```bash
npm install
npm run dev
```
<<<<<<< HEAD

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> 1dbbc84 (Initial commit from Create Next App)
=======
Open [http://localhost:3000](http://localhost:3000) to explore the dashboard.
>>>>>>> 0550c7b (initial commit)
