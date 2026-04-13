import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search, Package, MapPin, Truck, Phone, Copy, Check,
  Clock, CheckCircle2, CircleDot, Circle, ArrowLeft,
  MessageCircle, Store, CreditCard, ShoppingBag, AlertCircle,
} from "lucide-react";
import { mockOrders, statusConfig, type Order, type OrderStatus } from "@/data/order-data";
import { products, formatRp } from "@/data/store-data";

const stepOrder: OrderStatus[] = [
  "pending_payment", "paid", "processing", "shipped", "in_transit", "out_for_delivery", "delivered",
];

function getStepIndex(status: OrderStatus) {
  if (status === "cancelled") return -1;
  return stepOrder.indexOf(status);
}

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const [query, setQuery] = useState(initialId);
  const [searched, setSearched] = useState(!!initialId);
  const [copiedTracking, setCopiedTracking] = useState(false);

  const order = searched ? mockOrders.find((o) => o.id.toLowerCase() === query.trim().toLowerCase() || o.trackingNumber?.toLowerCase() === query.trim().toLowerCase()) : null;

  const handleSearch = () => {
    if (query.trim()) setSearched(true);
  };

  const copyTracking = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const currentStepIndex = order ? getStepIndex(order.status) : -1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-bold text-sm flex-1">Lacak Pesanan</h1>
          <Package className="h-4 w-4 text-muted-foreground" />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Search */}
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Lacak Pesanan Anda</h2>
            <p className="text-sm text-muted-foreground mt-1">Masukkan nomor order atau nomor resi untuk melacak pesanan</p>
          </div>
          <div className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ORD-XXXXXXXXXX atau nomor resi..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9 h-11"
              />
            </div>
            <Button className="h-11 px-6" onClick={handleSearch}>Lacak</Button>
          </div>
          <div className="flex gap-2 justify-center text-[11px] text-muted-foreground">
            <span>Contoh:</span>
            {["ORD-2026041301", "JNE-1234567890"].map((ex) => (
              <button
                key={ex}
                onClick={() => { setQuery(ex); setSearched(true); }}
                className="font-mono bg-muted px-2 py-0.5 rounded hover:bg-muted/80 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Not Found */}
        {searched && !order && (
          <Card className="animate-fade-in">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <h3 className="font-semibold mb-1">Pesanan Tidak Ditemukan</h3>
              <p className="text-sm text-muted-foreground">Periksa kembali nomor order atau nomor resi Anda.</p>
            </CardContent>
          </Card>
        )}

        {/* Order Found */}
        {order && (
          <div className="space-y-4 animate-fade-in">
            {/* Status Banner */}
            <Card className={`border-2 ${order.status === "delivered" ? "border-success/30" : order.status === "cancelled" ? "border-destructive/30" : "border-primary/30"}`}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${statusConfig[order.status].bgColor}`}>
                      {order.status === "delivered" ? (
                        <CheckCircle2 className={`h-6 w-6 ${statusConfig[order.status].color}`} />
                      ) : order.status === "cancelled" ? (
                        <AlertCircle className={`h-6 w-6 ${statusConfig[order.status].color}`} />
                      ) : (
                        <Truck className={`h-6 w-6 ${statusConfig[order.status].color}`} />
                      )}
                    </div>
                    <div>
                      <Badge className={`${statusConfig[order.status].bgColor} ${statusConfig[order.status].color} border-0 text-xs mb-1`}>
                        {statusConfig[order.status].label}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {order.status === "delivered"
                          ? `Diterima pada ${order.trackingEvents[order.trackingEvents.length - 1].timestamp}`
                          : `Estimasi tiba: ${order.estimatedDelivery}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Order ID</p>
                    <p className="font-mono font-bold text-sm">{order.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Steps */}
            {order.status !== "cancelled" && (
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between overflow-x-auto pb-2">
                    {stepOrder.map((step, i) => {
                      const isDone = i <= currentStepIndex;
                      const isCurrent = i === currentStepIndex;
                      const cfg = statusConfig[step];
                      return (
                        <div key={step} className="flex items-center flex-1 last:flex-none">
                          <div className="flex flex-col items-center gap-1 min-w-[48px]">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                              isCurrent
                                ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                                : isDone
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {isDone ? "✓" : i + 1}
                            </div>
                            <span className={`text-[9px] text-center font-medium leading-tight ${isCurrent ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground"}`}>
                              {cfg.label.split(" ").slice(0, 2).join(" ")}
                            </span>
                          </div>
                          {i < stepOrder.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 rounded ${i < currentStepIndex ? "bg-primary" : "bg-muted"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Timeline */}
              <Card className="lg:col-span-3">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> Riwayat Tracking
                  </h3>
                  <div className="space-y-0">
                    {[...order.trackingEvents].reverse().map((ev, i) => {
                      const isLatest = i === 0;
                      return (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            {isLatest ? (
                              <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-primary/20 shrink-0 mt-0.5" />
                            ) : (
                              <div className="h-3 w-3 rounded-full border-2 border-muted-foreground/30 shrink-0 mt-1" />
                            )}
                            {i < order.trackingEvents.length - 1 && (
                              <div className={`w-0.5 flex-1 min-h-[40px] ${isLatest ? "bg-primary/30" : "bg-border"}`} />
                            )}
                          </div>
                          <div className="pb-5">
                            <p className={`text-sm font-medium ${isLatest ? "text-primary" : ""}`}>{ev.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{ev.description}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-[11px] text-muted-foreground">{ev.timestamp}</span>
                              {ev.location && (
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-2.5 w-2.5" /> {ev.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Order Details */}
              <div className="lg:col-span-2 space-y-4">
                {/* Shipping Info */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Truck className="h-4 w-4 text-primary" /> Info Pengiriman
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Kurir</span>
                        <span className="font-medium">{order.shippingMethod}</span>
                      </div>
                      {order.trackingNumber && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">No. Resi</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-medium text-xs">{order.trackingNumber}</span>
                            <button onClick={copyTracking} className="p-1 rounded hover:bg-muted transition-colors">
                              {copiedTracking ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimasi</span>
                        <span className="font-medium">{order.estimatedDelivery}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Address */}
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" /> Alamat Tujuan
                    </h3>
                    <div className="text-sm">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{order.customerPhone}</p>
                      <p className="text-muted-foreground text-xs mt-1">{order.address}</p>
                      <p className="text-muted-foreground text-xs">{order.city}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment */}
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" /> Pembayaran
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Metode</span>
                        <span className="font-medium">{order.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"} className="text-[10px]">
                          {order.paymentStatus === "paid" ? "✓ Lunas" : "Menunggu"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Items */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-primary" /> Produk
                    </h3>
                    <div className="divide-y">
                      {order.items.map((item, idx) => {
                        const p = products.find((pr) => pr.id === item.productId);
                        if (!p) return null;
                        return (
                          <div key={idx} className="flex items-center gap-2.5 py-2">
                            <img src={p.img} alt={p.name} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{p.name}</p>
                              <p className="text-[11px] text-muted-foreground">{item.qty}x {formatRp(item.price)}</p>
                            </div>
                            <p className="text-xs font-semibold shrink-0">{formatRp(item.price * item.qty)}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="space-y-1.5 pt-2 border-t text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatRp(order.subtotal)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Ongkir</span><span>{formatRp(order.shippingCost)}</span></div>
                      <div className="flex justify-between pt-1.5 border-t font-bold"><span>Total</span><span className="text-primary">{formatRp(order.total)}</span></div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-2">
                  <a href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo, saya ingin bertanya tentang pesanan ${order.id}`)}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" className="w-full gap-2 text-xs">
                      <MessageCircle className="h-4 w-4" /> Hubungi Penjual
                    </Button>
                  </a>
                  <Link to={`/store/${order.storeSlug}`} className="flex-1">
                    <Button variant="outline" className="w-full gap-2 text-xs">
                      <Store className="h-4 w-4" /> Kunjungi Toko
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
