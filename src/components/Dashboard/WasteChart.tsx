import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const WasteChart = () => {
  const monthlyData = [
    { month: "Jan", collected: 1200, processed: 1100, recycled: 800 },
    { month: "Feb", collected: 1350, processed: 1250, recycled: 900 },
    { month: "Mar", collected: 1400, processed: 1320, recycled: 950 },
    { month: "Apr", collected: 1300, processed: 1200, recycled: 850 },
    { month: "May", collected: 1500, processed: 1400, recycled: 1050 },
    { month: "Jun", collected: 1450, processed: 1380, recycled: 1000 },
  ];

  const wasteTypes = [
    { name: "Organic", value: 45, color: "hsl(var(--waste-composting))" },
    { name: "Recyclable", value: 30, color: "hsl(var(--waste-recycling))" },
    { name: "Hazardous", value: 15, color: "hsl(var(--warning))" },
    { name: "Other", value: 10, color: "hsl(var(--muted-foreground))" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Waste Processing */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Monthly Waste Processing</h3>
          <p className="text-sm text-muted-foreground">Collected vs Processed vs Recycled (in tonnes)</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }} 
            />
            <Bar dataKey="collected" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="processed" fill="hsl(var(--waste-recycling))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="recycled" fill="hsl(var(--waste-composting))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Waste Type Distribution */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Waste Type Distribution</h3>
          <p className="text-sm text-muted-foreground">Current month breakdown by category</p>
        </div>
        <div className="flex items-center justify-between">
          <ResponsiveContainer width="60%" height={200}>
            <PieChart>
              <Pie
                data={wasteTypes}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {wasteTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-3">
            {wasteTypes.map((type, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: type.color }}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{type.name}</p>
                  <p className="text-xs text-muted-foreground">{type.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WasteChart;