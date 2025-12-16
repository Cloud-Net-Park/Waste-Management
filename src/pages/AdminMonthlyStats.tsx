import { Card } from "@/components/ui/card";

interface MonthlyStat {
  month: string;
  wasteProcessed: number; // in kg
  co2Saved: number; // in tons
  efficiency: number; // in percent
}

const stats: MonthlyStat[] = [
  { month: "January", wasteProcessed: 95000, co2Saved: 70, efficiency: 85 },
  { month: "February", wasteProcessed: 102000, co2Saved: 80, efficiency: 87 },
  { month: "March", wasteProcessed: 110000, co2Saved: 90, efficiency: 88 },
  { month: "April", wasteProcessed: 120000, co2Saved: 100, efficiency: 89 },
  { month: "May", wasteProcessed: 125000, co2Saved: 105, efficiency: 90 },
];

export default function AdminMonthlyStats() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Monthly Waste Processing</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-card border rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2">Month</th>
              <th className="px-4 py-2">Waste Processed (kg)</th>
              <th className="px-4 py-2">CO₂ Saved (tons)</th>
              <th className="px-4 py-2">Efficiency (%)</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <tr key={stat.month} className="text-center">
                <td className="px-4 py-2 font-semibold">{stat.month}</td>
                <td className="px-4 py-2">{stat.wasteProcessed.toLocaleString()}</td>
                <td className="px-4 py-2">{stat.co2Saved}</td>
                <td className="px-4 py-2">{stat.efficiency}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
