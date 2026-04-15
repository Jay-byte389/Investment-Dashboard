// ============================================================
// Investor Types
// ============================================================

export type RiskPreference = 'Low' | 'Medium' | 'High';

export interface Investor {
  id: number;
  name: string;
  riskPreference: RiskPreference;
  budget: number;
  preferredIndustries: string[];
  totalInvested?: number;
  portfolioROI?: number;
  activeDeals?: number;
}