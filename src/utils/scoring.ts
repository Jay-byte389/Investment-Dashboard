/**
 * utils/scoring.ts
 * Recommendation engine — scores deals for a given investor profile.
 * Pure function: no side effects, safe with useMemo.
 */

import { Deal, RecommendedDeal } from '@/types/deal';
import { Investor } from '@/types/investor';

const RISK_ORDER: Record<string, number> = { Low: 1, Medium: 2, High: 3 };

/**
 * Scores a single deal against an investor's profile (0–100).
 * Returns score + human-readable match reasons.
 */
export function scoreDeal(deal: Deal, investor: Investor): { score: number; matchReasons: string[] } {
  let score = 0;
  const matchReasons: string[] = [];

  // 1. Risk match (0–30 pts)
  const dealRisk = RISK_ORDER[deal.risk];
  const invRisk = RISK_ORDER[investor.riskPreference];
  if (dealRisk === invRisk) {
    score += 30;
    matchReasons.push('Perfect risk match');
  } else if (Math.abs(dealRisk - invRisk) === 1) {
    score += 15;
    matchReasons.push('Near risk match');
  }

  // 2. Industry match (0–25 pts)
  if (investor.preferredIndustries.includes(deal.industry)) {
    score += 25;
    matchReasons.push(`Preferred industry: ${deal.industry}`);
  }

  // 3. Budget compatibility (0–25 pts)
  if (deal.investmentRequired <= investor.budget) {
    const ratio = deal.investmentRequired / investor.budget;
    if (ratio >= 0.5) {
      score += 25;
      matchReasons.push('Within budget with good utilization');
    } else {
      score += 12;
      matchReasons.push('Within budget');
    }
  }

  // 4. ROI attractiveness (0–20 pts)
  if (deal.roi >= 25) { score += 20; matchReasons.push('High ROI (≥25%)'); }
  else if (deal.roi >= 18) { score += 12; matchReasons.push('Solid ROI'); }
  else if (deal.roi >= 12) { score += 6; }

  return { score: Math.min(score, 100), matchReasons };
}

/**
 * Scores and sorts all deals for the given investor.
 * Memoize using useMemo in the calling component.
 */
export function getRecommendedDeals(deals: Deal[], investor: Investor): RecommendedDeal[] {
  return deals
    .map((deal) => {
      const { score, matchReasons } = scoreDeal(deal, investor);
      return { ...deal, score, matchReasons };
    })
    .sort((a, b) => b.score - a.score);
}
