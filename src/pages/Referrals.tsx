import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Gift, MousePointerClick, Users, Zap } from "lucide-react";
import { useState } from "react";

const referralLink = "https://autopilot.ai/ref/ANDI-GR0W7H";

const stats = [
  { label: "Total Clicks", value: "1,284", icon: MousePointerClick, color: "bg-info/10 text-info" },
  { label: "Successful Referrals", value: "23", icon: Users, color: "bg-success/10 text-success" },
  { label: "Earned AI Credits", value: "4,600", icon: Zap, color: "bg-warning/10 text-warning" },
];

const recentReferrals = [
  { name: "Dewi Lestari", status: "converted", reward: "200 credits", date: "Apr 10, 2026" },
  { name: "Rudi Hermawan", status: "converted", reward: "200 credits", date: "Apr 8, 2026" },
  { name: "Nurul Aini", status: "pending", reward: "—", date: "Apr 7, 2026" },
  { name: "Bambang Suryadi", status: "converted", reward: "200 credits", date: "Apr 3, 2026" },
  { name: "Citra Kirana", status: "pending", reward: "—", date: "Apr 1, 2026" },
];

export default function Referrals() {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Referral & Partner Hub</h1>
        <p className="text-muted-foreground text-sm mt-1">Earn AI credits for every successful referral. Both you and your friend get rewarded.</p>
      </div>

      <Card className="border-primary/20 bg-accent/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Gift className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Two-Sided Rewards</h3>
              <p className="text-xs text-muted-foreground">You get 200 AI credits • Your friend gets 100 AI credits on signup</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 px-4 py-2.5 rounded-lg bg-card border text-sm font-mono truncate">
              {referralLink}
            </div>
            <Button onClick={copyLink} className="gap-2 shrink-0">
              {copied ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy Link</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="metric-card">
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-3 font-medium">Name</th>
                  <th className="text-center py-3 font-medium">Status</th>
                  <th className="text-right py-3 font-medium">Reward</th>
                  <th className="text-right py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentReferrals.map((r) => (
                  <tr key={r.name + r.date} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-medium">{r.name}</td>
                    <td className="py-3 text-center">
                      <Badge variant={r.status === "converted" ? "default" : "secondary"} className="text-[10px]">
                        {r.status === "converted" ? "Converted" : "Pending"}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">{r.reward}</td>
                    <td className="py-3 text-right text-muted-foreground">{r.date}</td>
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
