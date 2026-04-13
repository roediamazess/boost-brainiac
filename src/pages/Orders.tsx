import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Package, Search, Eye, Truck, Clock, CheckCircle2,
  AlertCircle, CreditCard, ArrowUpRight, Filter, ShoppingBag,
  DollarSign, TrendingUp,
} from "lucide-react";
import { mockOrders, statusConfig, type OrderStatus } from "@/data/order-data";
import { products, formatRp } from "@/data/store-data";

const filterTabs: { label: string; value: string; count?: number }[] = [
  { label: "Semua", value: "all" },
  { label: "Menunggu Bayar", value: "pending_payment" },
  { label: "Diproses", value: "processing" },
  { label: "Dikirim", value: "shipped,in_transit,out_for_delivery" },
  { label: "Selesai", value: "delivered" },
  { label: "Batal", value: "cancelled" },
];

const stats = [
  { label: "Total Pesanan", value: mockOrders.length.toString(), icon: ShoppingBag, color: "bg-primary/10 text-primary", change: "+5 hari ini" },
  { label: "Perlu Diproses", value: mockOrders.filter((o) => o.status === "paid" || o.status === "processing").length.toString(), icon: Clock, color: "bg-warning/10 text-warning", change: "Action needed" },
  { label: "Dalam Pengiriman", value: mockOrders.filter((o) => ["shipped", "in_transit", "out_for_delivery"].includes(o.status)).length.toString(), icon: Truck, color: "bg-info/10 text-info", change: "On track" },
  { label: "Pendapatan", value: formatRp(mockOrders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0)), icon: DollarSign, color: "bg-success/10 text-success", change: "+12.5%" },
];

export default function Orders() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = mockOrders.filter((o) => {
    const matchFilter = filter === "all" || filter.split(",").includes(o.status);
    const matchSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (o.trackingNumber?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchFilter && matchSearch;
  });

  const statusIcon = (status: OrderStatus) => {
    switch (status) {
      case "delivered": return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "cancelled": return <AlertCircle className="h-3.5 w-3.5" />;
      case "pending_payment": return <CreditCard className="h-3.5 w-3.5" />;
      default: return <Truck className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pesanan</h1>
        <p className="text-muted-foreground text-sm mt-1">Kelola semua pesanan dari webstore dan reseller.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="metric-card">
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold mt-1">{s.value}</p>
                  <span className="text-[10px] text-muted-foreground">{s.change}</span>
                </div>
                <div className={`p-2 rounded-lg ${s.color}`}>
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filterTabs.map((tab) => {
            const count = tab.value === "all"
              ? mockOrders.length
              : mockOrders.filter((o) => tab.value.split(",").includes(o.status)).length;
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  filter === tab.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  filter === tab.value ? "bg-primary-foreground/20" : "bg-background"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari order ID, nama, atau resi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                  <th className="text-left py-3 px-4 font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium">Pelanggan</th>
                  <th className="text-left py-3 px-4 font-medium">Produk</th>
                  <th className="text-right py-3 px-4 font-medium">Total</th>
                  <th className="text-left py-3 px-4 font-medium">Pengiriman</th>
                  <th className="text-center py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Tanggal</th>
                  <th className="text-center py-3 px-4 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-medium text-xs">{order.id}</span>
                      {order.storeName !== "UrbanStyle Indonesia" && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">via {order.storeName}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-xs">{order.customerName}</p>
                      <p className="text-[10px] text-muted-foreground">{order.city.split(",")[0]}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center -space-x-2">
                        {order.items.slice(0, 3).map((item, i) => {
                          const p = products.find((pr) => pr.id === item.productId);
                          return p ? (
                            <img key={i} src={p.img} alt={p.name} className="h-7 w-7 rounded-md object-cover border-2 border-card" />
                          ) : null;
                        })}
                        {order.items.length > 3 && (
                          <span className="h-7 w-7 rounded-md bg-muted border-2 border-card flex items-center justify-center text-[9px] font-medium">
                            +{order.items.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-xs">{formatRp(order.total)}</td>
                    <td className="py-3 px-4">
                      <p className="text-xs">{order.shippingCourier}</p>
                      {order.trackingNumber && (
                        <p className="text-[10px] text-muted-foreground font-mono">{order.trackingNumber}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={`${statusConfig[order.status].bgColor} ${statusConfig[order.status].color} border-0 text-[10px] gap-1`}>
                        {statusIcon(order.status)}
                        {statusConfig[order.status].label}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <a href={`/track?id=${order.id}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      <Package className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Tidak ada pesanan ditemukan</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
