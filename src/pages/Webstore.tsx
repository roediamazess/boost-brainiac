import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Store, ShoppingCart, Package, RefreshCw, Search, Heart,
  Star, Plus, Minus, Trash2, CreditCard, Banknote, QrCode,
  BarChart3, ArrowUpRight, Eye, ShoppingBag, Smartphone,
} from "lucide-react";

import imgKaos from "@/assets/product-kaos.jpg";
import imgTotebag from "@/assets/product-totebag.jpg";
import imgHoodie from "@/assets/product-hoodie.jpg";
import imgJogger from "@/assets/product-jogger.jpg";
import imgCap from "@/assets/product-cap.jpg";
import imgFlannel from "@/assets/product-flannel.jpg";

// ─── Data ────────────────────────────────────────────
const products = [
  { id: 1, name: "Kaos Polos Premium", sku: "KPP-001", price: 89000, stock: 142, online: 138, status: "synced", img: imgKaos, rating: 4.8, sold: 1240, category: "Tops" },
  { id: 2, name: "Tote Bag Canvas", sku: "TBC-045", price: 65000, stock: 87, online: 87, status: "synced", img: imgTotebag, rating: 4.6, sold: 890, category: "Accessories" },
  { id: 3, name: "Hoodie Oversize", sku: "HOS-012", price: 185000, stock: 34, online: 31, status: "syncing", img: imgHoodie, rating: 4.9, sold: 2100, category: "Tops" },
  { id: 4, name: "Celana Jogger", sku: "CJG-099", price: 125000, stock: 56, online: 56, status: "synced", img: imgJogger, rating: 4.5, sold: 760, category: "Bottoms" },
  { id: 5, name: "Snapback Cap", sku: "SBC-023", price: 45000, stock: 210, online: 208, status: "synced", img: imgCap, rating: 4.3, sold: 1580, category: "Accessories" },
  { id: 6, name: "Kemeja Flanel", sku: "KFL-077", price: 149000, stock: 0, online: 0, status: "out", img: imgFlannel, rating: 4.7, sold: 430, category: "Tops" },
];

const channels = [
  { name: "Shopee", orders: 128, revenue: "Rp 24.5M", icon: "🟠" },
  { name: "Tokopedia", orders: 96, revenue: "Rp 18.2M", icon: "🟢" },
  { name: "TikTok Shop", orders: 74, revenue: "Rp 12.8M", icon: "⚫" },
  { name: "Offline POS", orders: 213, revenue: "Rp 38.1M", icon: "🏪" },
];

const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

type CartItem = { id: number; qty: number };

// ─── Component ───────────────────────────────────────
export default function Webstore() {
  const [aiManager, setAiManager] = useState(true);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, qty: 2 },
    { id: 3, qty: 1 },
  ]);
  const [posSearch, setPosSearch] = useState("");

  const addToCart = (id: number) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === id);
      if (existing) return c.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { id, qty: 1 }];
    });
  };
  const updateQty = (id: number, delta: number) => {
    setCart((c) =>
      c
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };
  const removeFromCart = (id: number) => setCart((c) => c.filter((i) => i.id !== id));

  const cartTotal = cart.reduce((sum, ci) => {
    const p = products.find((pr) => pr.id === ci.id);
    return sum + (p ? p.price * ci.qty : 0);
  }, 0);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const posFiltered = products.filter(
    (p) =>
      p.stock > 0 &&
      (p.name.toLowerCase().includes(posSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(posSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Webstore & POS</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Unified commerce across online and offline channels.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-card border rounded-xl px-4 py-2.5 shadow-sm">
          <Smartphone className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI Store Manager</span>
          <Switch checked={aiManager} onCheckedChange={setAiManager} />
          <Badge
            variant={aiManager ? "default" : "secondary"}
            className="text-[10px]"
          >
            {aiManager ? "● Active" : "Off"}
          </Badge>
        </div>
      </div>

      {/* Channel Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {channels.map((ch) => (
          <Card
            key={ch.name}
            className="overflow-hidden hover:shadow-md transition-all group"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg">{ch.icon}</span>
                <span className="h-2 w-2 rounded-full bg-success" />
              </div>
              <p className="text-xs text-muted-foreground">{ch.name}</p>
              <p className="text-xl font-bold mt-0.5">{ch.revenue}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-xs text-success font-medium">
                  {ch.orders} orders
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="webstore" className="space-y-4">
        <TabsList className="h-11 p-1">
          <TabsTrigger value="webstore" className="gap-2 px-4">
            <ShoppingBag className="h-4 w-4" /> Webstore
          </TabsTrigger>
          <TabsTrigger value="pos" className="gap-2 px-4">
            <Store className="h-4 w-4" /> Point of Sale
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2 px-4">
            <Package className="h-4 w-4" /> Inventory
          </TabsTrigger>
        </TabsList>

        {/* ─── WEBSTORE TAB ──────────────────────── */}
        <TabsContent value="webstore" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Badge variant="secondary" className="text-xs shrink-0">
              {filteredProducts.length} produk
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
              <Card
                key={p.id}
                className="group overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative overflow-hidden aspect-square bg-muted">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {p.status === "out" && (
                    <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                      <Badge variant="destructive">Habis</Badge>
                    </div>
                  )}
                  <button className="absolute top-2 right-2 p-1.5 rounded-full bg-card/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {p.sold > 1000 && (
                    <Badge className="absolute top-2 left-2 text-[9px] bg-warning text-warning-foreground">
                      Best Seller
                    </Badge>
                  )}
                </div>
                <CardContent className="p-3.5 space-y-2">
                  <p className="text-[11px] text-muted-foreground">{p.category}</p>
                  <h3 className="text-sm font-semibold leading-tight line-clamp-1">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="text-xs font-medium">{p.rating}</span>
                    <span className="text-[10px] text-muted-foreground">
                      · {p.sold.toLocaleString()} terjual
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-bold text-primary">
                      {formatRp(p.price)}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      disabled={p.status === "out"}
                      onClick={() => addToCart(p.id)}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── POS TAB ───────────────────────────── */}
        <TabsContent value="pos">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Product grid */}
            <div className="lg:col-span-3 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Scan barcode atau cari produk / SKU..."
                  value={posSearch}
                  onChange={(e) => setPosSearch(e.target.value)}
                  className="pl-9 h-12 text-base"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {posFiltered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p.id)}
                    className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all text-left active:scale-[0.98]"
                  >
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      className="h-12 w-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.sku}</p>
                      <p className="text-sm font-bold text-primary mt-0.5">
                        {formatRp(p.price)}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-[10px] shrink-0"
                    >
                      {p.stock}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Cart panel */}
            <Card className="lg:col-span-2 flex flex-col">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" /> Keranjang
                  <Badge variant="secondary" className="ml-auto text-[10px]">
                    {cart.length} item
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <div className="divide-y max-h-[320px] overflow-y-auto">
                  {cart.length === 0 && (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      Keranjang kosong. Tap produk untuk menambahkan.
                    </div>
                  )}
                  {cart.map((ci) => {
                    const p = products.find((pr) => pr.id === ci.id);
                    if (!p) return null;
                    return (
                      <div key={ci.id} className="flex items-center gap-3 p-3">
                        <img
                          src={p.img}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatRp(p.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQty(ci.id, -1)}
                            className="h-7 w-7 rounded-md bg-muted flex items-center justify-center hover:bg-muted-foreground/10 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">
                            {ci.qty}
                          </span>
                          <button
                            onClick={() => updateQty(ci.id, 1)}
                            className="h-7 w-7 rounded-md bg-muted flex items-center justify-center hover:bg-muted-foreground/10 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(ci.id)}
                          className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="border-t p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">{formatRp(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pajak (11%)</span>
                    <span className="font-semibold">
                      {formatRp(Math.round(cartTotal * 0.11))}
                    </span>
                  </div>
                  <div className="flex justify-between text-base pt-2 border-t">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">
                      {formatRp(Math.round(cartTotal * 1.11))}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <Button variant="outline" className="flex-col h-auto py-2.5 gap-1">
                      <Banknote className="h-4 w-4" />
                      <span className="text-[10px]">Tunai</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-auto py-2.5 gap-1">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-[10px]">Kartu</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-auto py-2.5 gap-1">
                      <QrCode className="h-4 w-4" />
                      <span className="text-[10px]">QRIS</span>
                    </Button>
                  </div>
                  <Button className="w-full h-11 text-sm gap-2" disabled={cart.length === 0}>
                    <ShoppingCart className="h-4 w-4" /> Proses Pembayaran
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── INVENTORY TAB ─────────────────────── */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {products.length} total produk · {products.filter((p) => p.status === "synced").length} tersinkron
              </span>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <RefreshCw className="h-3 w-3" /> Sync Semua
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                      <th className="text-left py-3 px-4 font-medium">Produk</th>
                      <th className="text-left py-3 px-4 font-medium">SKU</th>
                      <th className="text-right py-3 px-4 font-medium">Harga</th>
                      <th className="text-right py-3 px-4 font-medium">Stok POS</th>
                      <th className="text-right py-3 px-4 font-medium">Stok Online</th>
                      <th className="text-center py-3 px-4 font-medium">Status</th>
                      <th className="text-center py-3 px-4 font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr
                        key={p.sku}
                        className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.img}
                              alt={p.name}
                              className="h-9 w-9 rounded-lg object-cover"
                            />
                            <span className="font-medium">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground font-mono text-xs">
                          {p.sku}
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          {formatRp(p.price)}
                        </td>
                        <td className="py-3 px-4 text-right">{p.stock}</td>
                        <td className="py-3 px-4 text-right">{p.online}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant={
                              p.status === "synced"
                                ? "default"
                                : p.status === "syncing"
                                ? "secondary"
                                : "destructive"
                            }
                            className="text-[10px]"
                          >
                            {p.status === "synced"
                              ? "✓ Synced"
                              : p.status === "syncing"
                              ? "⟳ Syncing"
                              : "✕ Habis"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
