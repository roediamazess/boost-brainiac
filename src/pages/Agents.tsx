import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Upload, Database, MessageSquare, ShoppingBag, Headphones, HelpCircle, FileText, Package } from "lucide-react";
import { useState } from "react";

const agents = [
  { name: "WhatsApp Sales Assistant", status: "active", messages: 4820, channel: "WhatsApp", icon: MessageSquare },
  { name: "Shopee Customer Support", status: "active", messages: 2310, channel: "Shopee", icon: Headphones },
  { name: "Order Processing Bot", status: "active", messages: 1890, channel: "Multi-channel", icon: ShoppingBag },
  { name: "FAQ Responder", status: "active", messages: 3140, channel: "All Channels", icon: HelpCircle },
  { name: "TikTok Shop Assistant", status: "paused", messages: 780, channel: "TikTok", icon: Package },
  { name: "Lead Qualifier", status: "active", messages: 1560, channel: "WhatsApp", icon: Bot },
];

const kbFiles = [
  { name: "Product Catalog 2024.pdf", size: "2.4 MB", date: "Dec 12, 2025" },
  { name: "FAQ Database.xlsx", size: "890 KB", date: "Jan 5, 2026" },
  { name: "Shipping Policies.docx", size: "156 KB", date: "Mar 20, 2026" },
  { name: "Return & Refund Guide.pdf", size: "1.1 MB", date: "Apr 1, 2026" },
];

export default function Agents() {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My AI Agents</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your AI workforce and knowledge base.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((a) => (
          <Card key={a.name} className="metric-card group">
            <CardContent className="p-0 space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <a.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge variant={a.status === "active" ? "default" : "secondary"} className="text-[10px]">
                  {a.status === "active" ? "● Active" : "⏸ Paused"}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold text-sm">{a.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{a.channel}</p>
              </div>
              <div className="flex items-center justify-between pt-1 border-t">
                <span className="text-xs text-muted-foreground">{a.messages.toLocaleString()} messages handled</span>
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2">Configure</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4" /> Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragOver ? "border-primary bg-accent" : "border-border"}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
            >
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Drop files here to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, XLSX, DOCX up to 25MB</p>
              <Button variant="outline" size="sm" className="mt-3">Browse Files</Button>
            </div>
            <div className="space-y-2">
              {kbFiles.map((f) => (
                <div key={f.name} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.name}</p>
                    <p className="text-[11px] text-muted-foreground">{f.size} · {f.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" /> POS Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-accent/50 border">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2.5 w-2.5 rounded-full bg-success" />
                <span className="text-sm font-medium">Connected to POS Inventory</span>
              </div>
              <p className="text-xs text-muted-foreground">Your AI agents can access real-time stock levels and product data from your POS system to assist customers 24/7.</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Products synced</span><span className="font-medium">529</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Last sync</span><span className="font-medium">2 minutes ago</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Auto-reply enabled</span><span className="font-medium text-success">Yes</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Out-of-stock handling</span><span className="font-medium">Suggest alternatives</span></div>
            </div>
            <Button className="w-full gap-2" variant="outline">
              <Package className="h-4 w-4" /> Manage POS Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
