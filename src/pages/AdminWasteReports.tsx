import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WasteReport {
  id: string;
  reporter: string;
  location: string;
  issue: string;
  date: string;
  status: "pending" | "resolved";
}

const initialReports: WasteReport[] = [
  {
    id: "1",
    reporter: "John Doe",
    location: "Sector 12, Main Road",
    issue: "Overflowing bins",
    date: "2025-09-10",
    status: "pending"
  },
  {
    id: "2",
    reporter: "Priya Singh",
    location: "Block B, Park Area",
    issue: "Uncollected waste",
    date: "2025-09-12",
    status: "resolved"
  }
];

export default function AdminWasteReports() {
  const [reports, setReports] = useState<WasteReport[]>(initialReports);

  const handleResolve = (id: string) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: "resolved" } : r));
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Reported Waste Issues</h2>
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold">{report.issue}</div>
              <div className="text-sm text-muted-foreground">{report.location} | {report.date}</div>
              <div className="text-xs">Reported by: {report.reporter}</div>
              <div className="text-xs text-muted-foreground">Status: {report.status}</div>
            </div>
            {report.status === "pending" && (
              <Button size="sm" onClick={() => handleResolve(report.id)}>Mark as Resolved</Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
