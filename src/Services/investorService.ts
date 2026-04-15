/**
 * investorService.ts
 * Simulates an async backend API for investors using local JSON data.
 */

import rawInvestors from '@/data/investors.json';
import { Investor } from '@/types/investor';
import rawDeals from '@/data/deals.json';
import { Deal } from '@/types/deal';

const deals: Deal[] = rawDeals as Deal[];

// Enrich investors with computed portfolio metrics
const investors: Investor[] = (rawInvestors as Investor[]).map((inv) => {
  // Simulated: assign random active deals within investor's budget
  const eligibleDeals = deals.filter(
    (d) => d.investmentRequired <= inv.budget && inv.preferredIndustries.includes(d.industry)
  );
  const activeDeals = Math.min(eligibleDeals.length, 3);
  const totalInvested = eligibleDeals
    .slice(0, activeDeals)
    .reduce((s, d) => s + d.fundingRaised / d.investorCount, 0);
  const portfolioROI =
    activeDeals > 0
      ? eligibleDeals.slice(0, activeDeals).reduce((s, d) => s + d.roi, 0) / activeDeals
      : 0;

  return { ...inv, totalInvested: Math.round(totalInvested), portfolioROI: +portfolioROI.toFixed(1), activeDeals };
});

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const randomDelay = () => delay(300 + Math.random() * 500);

/** Get all investors */
export const getInvestors = async (): Promise<Investor[]> => {
  await randomDelay();
  return investors;
};

/** Get a single investor by ID */
export const getInvestorById = async (id: number): Promise<Investor> => {
  await randomDelay();
  const investor = investors.find((i) => i.id === id);
  if (!investor) throw new Error(`Investor with id ${id} not found`);
  return investor;
};

/** Get corporate dashboard metrics (aggregate across all investors) */
export const getCorporateMetrics = async () => {
  await randomDelay();
  const totalInvestors = investors.length;
  const totalFundingCommitted = investors.reduce((s, i) => s + (i.totalInvested || 0), 0);
  const avgBudget = investors.reduce((s, i) => s + i.budget, 0) / totalInvestors;
  const totalActiveDeals = investors.reduce((s, i) => s + (i.activeDeals || 0), 0);
  const conversionRate = +((totalActiveDeals / (totalInvestors * 3)) * 100).toFixed(1);

  // Industry preference breakdown
  const industryInterest = investors.reduce<Record<string, number>>((acc, inv) => {
    inv.preferredIndustries.forEach((ind) => {
      acc[ind] = (acc[ind] || 0) + 1;
    });
    return acc;
  }, {});

  // Risk preference breakdown
  const riskBreakdown = investors.reduce<Record<string, number>>((acc, inv) => {
    acc[inv.riskPreference] = (acc[inv.riskPreference] || 0) + 1;
    return acc;
  }, {});

  return {
    totalInvestors,
    totalFundingCommitted: Math.round(totalFundingCommitted),
    avgBudget: Math.round(avgBudget),
    totalActiveDeals,
    conversionRate,
    industryInterest,
    riskBreakdown,
  };
};