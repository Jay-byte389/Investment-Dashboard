/**
 * utils/formatters.ts
 * Formatting helpers used across components. Pure functions.
 */

/** Format a number as USD currency */
export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

/** Format a number as a percentage string */
export const formatPercent = (value: number): string => `${value.toFixed(1)}%`;

/** Format a large number with K/M suffix */
export const formatCompact = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
};

/** Map risk level to a Tailwind color class */
export const riskColor = (risk: string): string => {
  switch (risk) {
    case 'Low':    return 'text-emerald-400';
    case 'Medium': return 'text-amber-400';
    case 'High':   return 'text-rose-400';
    default:       return 'text-slate-400';
  }
};

/** Map risk level to a badge class */
export const riskBadgeClass = (risk: string): string => {
  switch (risk) {
    case 'Low':    return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    case 'Medium': return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    case 'High':   return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
    default:       return 'bg-slate-500/20 text-slate-300';
  }
};

/** Map industry to an emoji icon */
export const industryIcon = (industry: string): string => {
  const map: Record<string, string> = {
    Tech: '💻', Healthcare: '🏥', Finance: '💰', Agriculture: '🌾',
    Education: '📚', Automobile: '🚗', 'Real Estate': '🏢', Energy: '⚡',
  };
  return map[industry] ?? '🏭';
};

/** Format a YYYY-MM-DD date string to a readable format */
export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

/** Format month key "YYYY-MM" to "Mon 'YY" */
export const formatMonth = (monthKey: string): string => {
  const [year, month] = monthKey.split('-');
  const d = new Date(+year, +month - 1);
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
};

/** Calculate funding progress percentage */
export const fundingProgress = (raised: number, required: number): number =>
  Math.min(Math.round((raised / required) * 100), 100);
