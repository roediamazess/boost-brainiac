import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Store, ShoppingCart, Package, RefreshCw, TrendingUp } from "lucide-react";
import { useState } from "react";

const products = [
  { name: "Kaos Polos Premium", sku: "KPP-001", price: "Rp 89,000", stock: 142, online: 138, status: "synced" },
  { name: "Tote Bag Canvas", sku: "TBC-045", price: "Rp 65,000", stock: 87, online: 87, status: "synced" },
  { name: "Hoodie Oversize", sku: "HOS-012", price: "Rp 185,000", stock: 34, online: 31, status: "syncing" },
  { name: "Celana Jogger", sku: "CJG-099", price: "Rp 125,000", stock: 56, online: 56, status: "synced" },
  { name: "Snapback Cap", sku: "SBC-023", price: "Rp 45,000", stock: 210, online: 208, status: "synced" },
  { name: "Kemeja Flanel", sku: "KFL-077", price: "Rp 149,000", stock: 0, online: 0, status: "out" },
];

const channels = [
  { name: "Shopee", orders: 128, revenue: "Rp 24.5M", connected: true },
  { name: "Tokopedia", orders: 96, revenue: "Rp 18.2M", connected: true },
  { name: "TikTok Shop", orders: 74, revenue: "Rp 12.8M", connected: true },
  { name: "Offline POS", orders: 213, revenue: "Rp 38.1M", connected: true },
];

export default function Webstore() {
  const [aiManager, setAiManager] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Webstore & POS</h1>
          <p className="text-muted-foreground text-sm mt-1">Unified commerce across online and offline channels.</p>
        </div>
        <div className="flex items-center gap-3 bg-card border rounded-lg px-4 py-2.5">
          <span className="text-sm font-medium">AI Store Manager</span>
          <Switch checked={aiManager} onCheckedChange={setAiManager} />
          <Badge variant={aiManager ? "default" : "secondary"} className="text-[10px]">
            {aiManager ? "Active" : "Off"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((ch) => (
          <Card key={ch.name} className="metric-card">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">{ch.name}</span>
                <span className="ml-auto h-2 w-2 rounded-full bg-success" />
              </div>
              <p className="text-lg font-bold">{ch.revenue}</p>
              <p className="text-xs text-muted-foreground">{ch.orders} orders this month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Product Inventory</CardTitle>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <RefreshCw className="h-3 w-3" /> Sync All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-3 font-medium">Product</th>
                  <th className="text-left py-3 font-medium">SKU</th>
                  <th className="text-right py-3 font-medium">Price</th>
                  <th className="text-right py-3 font-medium">POS Stock</th>
                  <th className="text-right py-3 font-medium">Online Stock</th>
                  <th className="text-center py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.sku} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 text-muted-foreground">{p.sku}</td>
                    <td className="py-3 text-right">{p.price}</td>
                    <td className="py-3 text-right">{p.stock}</td>
                    <td className="py-3 text-right">{p.online}</td>
                    <td className="py-3 text-center">
                      <Badge variant={p.status === "synced" ? "default" : p.status === "syncing" ? "secondary" : "destructive"} className="text-[10px]">
                        {p.status === "synced" ? "Synced" : p.status === "syncing" ? "Syncing…" : "Out of Stock"}
                      </Badge>
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
