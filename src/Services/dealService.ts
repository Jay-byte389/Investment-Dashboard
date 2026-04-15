/**
 * dealService.ts
 * Simulates an async backend API for deals using local JSON data.
 * Supports filtering, sorting, pagination, and error simulation.
 */

import rawDeals from '@/data/deals.json';
import { Deal, DealQueryParams, DealResponse } from '@/types/deal';

const deals: Deal[] = rawDeals as Deal[];

/** Simulate network latency */
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const randomDelay = () => delay(300 + Math.random() * 500);

/** Optionally simulate random errors (disabled by default) */
const maybeThrow = (chance = 0) => {
  if (Math.random() < chance) throw new Error('Simulated network error');
};

/** Fetch paginated, filtered, sorted deals */
export const getDeals = async (params: DealQueryParams = {}): Promise<DealResponse> => {
  await randomDelay();
  maybeThrow(0); // set to 0.05 to enable 5% random errors

  const {
    search = '',
    minRoi,
    maxRoi,
    risk,
    industry,
    minInvestment,
    maxInvestment,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = params;

  let result = [...deals];

  // 🔍 Search by company name
  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter((d) => d.company.toLowerCase().includes(q));
  }

  // 🎯 Filter by risk level
  if (risk) result = result.filter((d) => d.risk === risk);

  // 🎯 Filter by industry
  if (industry) result = result.filter((d) => d.industry === industry);

  // 🎯 Filter by ROI range
  if (minRoi !== undefined) result = result.filter((d) => d.roi >= minRoi);
  if (maxRoi !== undefined) result = result.filter((d) => d.roi <= maxRoi);

  // 🎯 Filter by investment range
  if (minInvestment !== undefined) result = result.filter((d) => d.investmentRequired >= minInvestment);
  if (maxInvestment !== undefined) result = result.filter((d) => d.investmentRequired <= maxInvestment);

  // 📊 Sorting
  switch (sort) {
    case 'roi_high':     result.sort((a, b) => b.roi - a.roi); break;
    case 'roi_low':      result.sort((a, b) => a.roi - b.roi); break;
    case 'investment_high': result.sort((a, b) => b.investmentRequired - a.investmentRequired); break;
    case 'investment_low':  result.sort((a, b) => a.investmentRequired - b.investmentRequired); break;
    case 'newest':
    default:
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = result.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = result.slice(start, start + limit);

  return { data, total, page, totalPages };
};

/** Fetch a single deal by ID */
export const getDealById = async (id: number): Promise<Deal> => {
  await randomDelay();
  maybeThrow(0);
  const deal = deals.find((d) => d.id === id);
  if (!deal) throw new Error(`Deal with id ${id} not found`);
  return deal;
};

/** Get all unique industries */
export const getIndustries = async (): Promise<string[]> => {
  await delay(150);
  return [...new Set(deals.map((d) => d.industry))].sort();
};

/** Get summary metrics for the dashboard */
export const getDashboardMetrics = async () => {
  await randomDelay();
  const totalDeals = deals.length;
  const totalFundingRaised = deals.reduce((sum, d) => sum + d.fundingRaised, 0);
  const avgROI = deals.reduce((sum, d) => sum + d.roi, 0) / totalDeals;
  const riskDistribution = {
    Low:    deals.filter((d) => d.risk === 'Low').length,
    Medium: deals.filter((d) => d.risk === 'Medium').length,
    High:   deals.filter((d) => d.risk === 'High').length,
  };
  const industryDistribution = deals.reduce<Record<string, number>>((acc, d) => {
    acc[d.industry] = (acc[d.industry] || 0) + 1;
    return acc;
  }, {});

  return { totalDeals, totalFundingRaised, avgROI, riskDistribution, industryDistribution };
};

/** Generate monthly investment growth data for line chart */
export const getInvestmentGrowth = async () => {
  await delay(300);
  // Group funding raised by month from createdAt
  const monthlyMap: Record<string, number> = {};
  deals.forEach((d) => {
    const month = d.createdAt.slice(0, 7); // "YYYY-MM"
    monthlyMap[month] = (monthlyMap[month] || 0) + d.fundingRaised;
  });
  return Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount], i, arr) => ({
      month,
      amount,
      cumulative: arr.slice(0, i + 1).reduce((s, [, v]) => s + v, 0),
    }));
};
