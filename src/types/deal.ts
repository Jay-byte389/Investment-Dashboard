// ============================================================
// Deal Types - Full schema aligned with deals.json
// ============================================================

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface Deal {
  id: number;
  company: string;
  industry: string;
  risk: RiskLevel;
  roi: number;
  investmentRequired: number;
  fundingRaised: number;
  investorCount: number;
  createdAt: string; // ISO date string
  description?: string;
}

// Query params for the service layer
export interface DealQueryParams {
  search?: string;
  minRoi?: number;
  maxRoi?: number;
  risk?: RiskLevel | '';
  industry?: string;
  minInvestment?: number;
  maxInvestment?: number;
  sort?: 'roi_high' | 'roi_low' | 'investment_high' | 'investment_low' | 'newest';
  page?: number;
  limit?: number;
}

export interface DealResponse {
  data: Deal[];
  total: number;
  page: number;
  totalPages: number;
}

export interface RecommendedDeal extends Deal {
  score: number;
  matchReasons: string[];
}