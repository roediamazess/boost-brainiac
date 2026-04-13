import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, CreditCard, Zap, Calendar, ArrowUpRight } from "lucide-react";

const plans = [
  { name: "Starter", price: "Rp 499K", period: "/mo", features: ["3 AI Agents", "5,000 messages/mo", "Basic analytics", "Email support"], current: false },
  { name: "Growth", price: "Rp 1.49M", period: "/mo", features: ["6 AI Agents", "25,000 messages/mo", "Advanced analytics", "Priority support", "POS integration"], current: true },
  { name: "Enterprise", price: "Custom", period: "", features: ["Unlimited agents", "Unlimited messages", "Custom AI training", "Dedicated CSM", "SLA guarantee"], current: false },
];

const usage = [
  { label: "AI Messages", used: 18420, limit: 25000, unit: "messages" },
  { label: "AI Tokens", used: 2100000, limit: 3000000, unit: "tokens" },
  { label: "Knowledge Base Storage", used: 4.2, limit: 10, unit: "GB" },
];

const invoices = [
  { date: "Apr 1, 2026", amount: "Rp 1,490,000", status: "paid" },
  { date: "Mar 1, 2026", amount: "Rp 1,490,000", status: "paid" },
  { date: "Feb 1, 2026", amount: "Rp 1,490,000", status: "paid" },
  { date: "Jan 1, 2026", amount: "Rp 1,290,000", status: "paid" },
];

export default function Billing() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing & Usage</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your subscription and monitor consumption.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <Card key={p.name} className={`relative ${p.current ? "border-primary shadow-md ring-1 ring-primary/20" : ""}`}>
            {p.current && (
              <Badge className="absolute -top-2.5 left-4 text-[10px]">Current Plan</Badge>
            )}
            <CardContent className="p-5 space-y-4 pt-6">
              <div>
                <h3 className="font-bold text-lg">{p.name}</h3>
                <div className="flex items-baseline gap-0.5 mt-1">
                  <span className="text-2xl font-bold">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.period}</span>
                </div>
              </div>
              <ul className="space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={p.current ? "outline" : "default"} className="w-full" disabled={p.current}>
                {p.current ? "Current Plan" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Usage This Month</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {usage.map((u) => {
            const pct = typeof u.used === "number" && typeof u.limit === "number"
              ? Math.round((u.used / u.limit) * 100) : 0;
            const formattedUsed = u.used >= 1000000 ? `${(u.used / 1000000).toFixed(1)}M` : u.used >= 1000 ? `${(u.used / 1000).toFixed(1)}K` : u.used;
            const formattedLimit = u.limit >= 1000000 ? `${(u.limit / 1000000).toFixed(0)}M` : u.limit >= 1000 ? `${(u.limit / 1000).toFixed(0)}K` : u.limit;
            return (
              <div key={u.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{u.label}</span>
                  <span className="text-muted-foreground">{formattedUsed} / {formattedLimit} {u.unit}</span>
                </div>
                <Progress value={pct} className="h-2.5" />
                <p className="text-xs text-muted-foreground">{pct}% used</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-3 font-medium">Date</th>
                  <th className="text-right py-3 font-medium">Amount</th>
                  <th className="text-center py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.date} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3">{inv.date}</td>
                    <td className="py-3 text-right font-medium">{inv.amount}</td>
                    <td className="py-3 text-center">
                      <Badge variant="default" className="text-[10px]">Paid</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
