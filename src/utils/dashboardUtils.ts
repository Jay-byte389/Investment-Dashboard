import {Deal} from "@/types/deal"

//Total Investment
export const getTotalInvestment =(deals:Deal[])=>
    deals.reduce((sum,d)=>sum+d.investmentRequired,0);

//Deals Active
export const getActiveDeals =(deals :Deal[])=>deals.length;

//ROI Average
export const getROIAverage =(deals:Deal[])=>{
    if (deals.length === 0) return 0;
     return deals.reduce((sum,d)=>sum+d.roi,0)/deals.length;
}
//Distribution Risk
export const getRiskDistribution = (deals: Deal[]) => {
    const result: Record<"Low" | "Medium" | "High", number> = {
        Low: 0,
        Medium: 0,
        High: 0,
      };
    deals.forEach((d) => {
      result[d.risk]++;
    });
  
    return Object.keys(result).map((key) => ({
      name: key,
      value: result[key as keyof typeof result],
    }));
  };
  

// 📊 Industry Distribution
export const getIndustryDistribution = (deals: Deal[]) => {
    const map: Record<string,number> = {};
  
    deals.forEach((d) => {
      map[d.industry] = (map[d.industry] || 0) + 1;
    });
  
    return Object.keys(map).map((key) => ({
      name: key,
      value: map[key],
    }));
  };


