import { MessageSquare, Clock, Bot, TrendingUp, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

const metrics = [
  { label: "Total Messages Automated", value: "24,831", change: "+12.5%", icon: MessageSquare, color: "bg-primary/10 text-primary" },
  { label: "Human Hours Saved", value: "1,247", change: "+8.3%", icon: Clock, color: "bg-success/10 text-success" },
  { label: "Active AI Agents", value: "6", change: "+2", icon: Bot, color: "bg-info/10 text-info" },
  { label: "Revenue Influenced", value: "Rp 182M", change: "+23.1%", icon: TrendingUp, color: "bg-warning/10 text-warning" },
];

const areaData = [
  { month: "Jan", messages: 2400, leads: 120 },
  { month: "Feb", messages: 3200, leads: 180 },
  { month: "Mar", messages: 2800, leads: 160 },
  { month: "Apr", messages: 4100, leads: 240 },
  { month: "May", messages: 5200, leads: 310 },
  { month: "Jun", messages: 4800, leads: 290 },
  { month: "Jul", messages: 6100, leads: 380 },
];

const channelData = [
  { channel: "WhatsApp", value: 45 },
  { channel: "Shopee", value: 22 },
  { channel: "Tokopedia", value: 18 },
  { channel: "TikTok", value: 15 },
];
const pieColors = ["#6366f1", "#64748b", "#14b8a6", "#f59e0b"];

const agentPerformance = [
  { name: "Sales Bot", conversations: 820, resolved: 780 },
  { name: "Support Bot", conversations: 640, resolved: 610 },
  { name: "Order Bot", conversations: 520, resolved: 505 },
  { name: "FAQ Bot", conversations: 380, resolved: 370 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Andi. Here's your AI performance overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="metric-card">
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                  <p className="text-2xl font-bold mt-1">{m.value}</p>
                  <span className="inline-flex items-center gap-0.5 text-xs font-medium text-success mt-1">
                    <ArrowUpRight className="h-3 w-3" /> {m.change}
                  </span>
                </div>
                <div className={`p-2.5 rounded-lg ${m.color}`}>
                  <m.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Messages & Leads Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,20%,90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215,14%,50%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,14%,50%)" />
                <Tooltip />
                <Area type="monotone" dataKey="messages" stroke="#6366f1" fill="url(#colorMessages)" strokeWidth={2} />
                <Area type="monotone" dataKey="leads" stroke="#14b8a6" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Channel Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={channelData} dataKey="value" nameKey="channel" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                  {channelData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2">
              {channelData.map((c, i) => (
                <div key={c.channel} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pieColors[i] }} />
                  {c.channel} ({c.value}%)
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Agent Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={agentPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,20%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(215,14%,50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,14%,50%)" />
              <Tooltip />
              <Bar dataKey="conversations" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
