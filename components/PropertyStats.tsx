import { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface PropertyStatsProps {
  property: Property;
}

export function PropertyStats({ property }: PropertyStatsProps) {
  const stats = [
    { label: "Units", value: property.units },
    { label: "Occupancy", value: property.occupancy },
    { label: "Acquisition Price", value: formatCurrency(property.acquisitionPrice) },
    { label: "Market Value", value: formatCurrency(property.marketValue) },
    { label: "Loan Balance", value: formatCurrency(property.loanBalance) },
    { label: "Equity", value: formatCurrency(property.equity) },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-muted/50 p-4 rounded-lg"
        >
          <div className="text-sm text-muted-foreground">{stat.label}</div>
          <div className="text-2xl font-bold mt-1">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}