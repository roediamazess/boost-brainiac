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
  Copy, Check, ExternalLink, Users, Percent, Link as LinkIcon,
} from "lucide-react";
import {
  products, ownerStore, resellerStores, formatRp, getStorePrice,
  type Product,
} from "@/data/store-data";

type CartItem = { id: number; qty: number };

export default function Webstore() {
  const [aiManager, setAiManager] = useState(true);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, qty: 2 },
    { id: 3, qty: 1 },
  ]);
  const [posSearch, setPosSearch] = useState("");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [posCategory, setPosCategory] = useState<string>("Semua");

  const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.category)))];

  const addToCart = (id: number) => {
    setCart((c) => {
      const ex = c.find((i) => i.id === id);
      return ex ? c.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)) : [...c, { id, qty: 1 }];
    });
  };
  const updateQty = (id: number, d: number) =>
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: i.qty + d } : i)).filter((i) => i.qty > 0));
  const removeFromCart = (id: number) => setCart((c) => c.filter((i) => i.id !== id));

  const cartTotal = cart.reduce((s, ci) => {
    const p = products.find((pr) => pr.id === ci.id);
    return s + (p ? p.price * ci.qty : 0);
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

  const storeUrl = (slug: string) => `${window.location.origin}/store/${slug}`;

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(storeUrl(slug));
    setCopiedLink(slug);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const channels = [
    { name: "Shopee", orders: 128, revenue: "Rp 24.5M", icon: "🟠" },
    { name: "Tokopedia", orders: 96, revenue: "Rp 18.2M", icon: "🟢" },
    { name: "TikTok Shop", orders: 74, revenue: "Rp 12.8M", icon: "⚫" },
    { name: "Offline POS", orders: 213, revenue: "Rp 38.1M", icon: "🏪" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Webstore & POS</h1>
          <p className="text-muted-foreground text-sm mt-1">Unified commerce across online and offline channels.</p>
        </div>
        <div className="flex items-center gap-3 bg-card border rounded-xl px-4 py-2.5 shadow-sm">
          <Smartphone className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI Store Manager</span>
          <Switch checked={aiManager} onCheckedChange={setAiManager} />
          <Badge variant={aiManager ? "default" : "secondary"} className="text-[10px]">
            {aiManager ? "● Active" : "Off"}
          </Badge>
        </div>
      </div>

      {/* Channel Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {channels.map((ch) => (
          <Card key={ch.name} className="overflow-hidden hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg">{ch.icon}</span>
                <span className="h-2 w-2 rounded-full bg-success" />
              </div>
              <p className="text-xs text-muted-foreground">{ch.name}</p>
              <p className="text-xl font-bold mt-0.5">{ch.revenue}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-xs text-success font-medium">{ch.orders} orders</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="mystore" className="space-y-4">
        <TabsList className="h-11 p-1">
          <TabsTrigger value="mystore" className="gap-2 px-4">
            <LinkIcon className="h-4 w-4" /> Toko Saya
          </TabsTrigger>
          <TabsTrigger value="resellers" className="gap-2 px-4">
            <Users className="h-4 w-4" /> Reseller
          </TabsTrigger>
          <TabsTrigger value="pos" className="gap-2 px-4">
            <Store className="h-4 w-4" /> POS Kasir
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2 px-4">
            <Package className="h-4 w-4" /> Inventori
          </TabsTrigger>
        </TabsList>

        {/* ─── MY STORE TAB ─────────────────── */}
        <TabsContent value="mystore" className="space-y-4">
          {/* Share Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-accent/40 to-background overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                  <Store className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <h2 className="text-lg font-bold">{ownerStore.name}</h2>
                  <p className="text-sm text-muted-foreground">{ownerStore.tagline}</p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <div className="flex-1 flex items-center gap-2 bg-card border rounded-lg px-3 py-2">
                      <LinkIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm font-mono truncate">{storeUrl(ownerStore.slug)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyLink(ownerStore.slug)}
                        className="gap-2 shrink-0"
                      >
                        {copiedLink === ownerStore.slug ? (
                          <><Check className="h-4 w-4" /> Tersalin!</>
                        ) : (
                          <><Copy className="h-4 w-4" /> Copy Link</>
                        )}
                      </Button>
                      <a href={storeUrl(ownerStore.slug)} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2">
                          <ExternalLink className="h-4 w-4" /> Lihat Toko
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Preview */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Produk di Webstore</h3>
            <Badge variant="secondary" className="text-xs">{products.filter(p => p.status !== "out").length} aktif</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {products.filter(p => p.status !== "out").map((p) => (
              <Card key={p.id} className="overflow-hidden group">
                <div className="aspect-square overflow-hidden">
                  <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-3 space-y-1">
                  <h4 className="text-xs font-semibold truncate">{p.name}</h4>
                  <p className="text-sm font-bold text-primary">{formatRp(p.price)}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="text-[10px]">{p.rating} · {p.sold} terjual</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── RESELLERS TAB ────────────────── */}
        <TabsContent value="resellers" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Reseller Partners</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Reseller menjual produk Anda dengan nama toko mereka sendiri dan markup harga.</p>
            </div>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Tambah Reseller
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {resellerStores.map((rs) => (
              <Card key={rs.slug} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center shrink-0">
                      <Store className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{rs.name}</h4>
                      <p className="text-xs text-muted-foreground">by {rs.owner}</p>
                    </div>
                    <Badge variant="default" className="text-[10px] shrink-0">Active</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                      <Percent className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
                      <p className="text-lg font-bold">{rs.markup}%</p>
                      <p className="text-[10px] text-muted-foreground">Markup</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                      <ShoppingBag className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
                      <p className="text-lg font-bold">{products.filter(p => p.status !== "out").length}</p>
                      <p className="text-[10px] text-muted-foreground">Produk</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2">
                    <LinkIcon className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="text-xs font-mono truncate flex-1">/store/{rs.slug}</span>
                    <button
                      onClick={() => copyLink(rs.slug)}
                      className="p-1 rounded hover:bg-muted transition-colors"
                    >
                      {copiedLink === rs.slug ? (
                        <Check className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </button>
                    <a href={storeUrl(rs.slug)} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </a>
                  </div>

                  <p className="text-xs text-muted-foreground italic">"{rs.tagline}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── POS TAB ──────────────────────── */}
        <TabsContent value="pos">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
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
                    <img src={p.img} alt={p.name} loading="lazy" className="h-12 w-12 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.sku}</p>
                      <p className="text-sm font-bold text-primary mt-0.5">{formatRp(p.price)}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">{p.stock}</Badge>
                  </button>
                ))}
              </div>
            </div>

            <Card className="lg:col-span-2 flex flex-col">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" /> Keranjang
                  <Badge variant="secondary" className="ml-auto text-[10px]">{cart.length} item</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <div className="divide-y max-h-[320px] overflow-y-auto">
                  {cart.length === 0 && (
                    <div className="p-8 text-center text-sm text-muted-foreground">Keranjang kosong</div>
                  )}
                  {cart.map((ci) => {
                    const p = products.find((pr) => pr.id === ci.id);
                    if (!p) return null;
                    return (
                      <div key={ci.id} className="flex items-center gap-3 p-3">
                        <img src={p.img} alt={p.name} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{formatRp(p.price)}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateQty(ci.id, -1)} className="h-7 w-7 rounded-md bg-muted flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                          <span className="text-sm font-semibold w-6 text-center">{ci.qty}</span>
                          <button onClick={() => updateQty(ci.id, 1)} className="h-7 w-7 rounded-md bg-muted flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                        </div>
                        <button onClick={() => removeFromCart(ci.id)} className="p-1.5 rounded-md hover:bg-destructive/10">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">{formatRp(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pajak (11%)</span>
                    <span className="font-semibold">{formatRp(Math.round(cartTotal * 0.11))}</span>
                  </div>
                  <div className="flex justify-between text-base pt-2 border-t">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">{formatRp(Math.round(cartTotal * 1.11))}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <Button variant="outline" className="flex-col h-auto py-2.5 gap-1"><Banknote className="h-4 w-4" /><span className="text-[10px]">Tunai</span></Button>
                    <Button variant="outline" className="flex-col h-auto py-2.5 gap-1"><CreditCard className="h-4 w-4" /><span className="text-[10px]">Kartu</span></Button>
                    <Button variant="outline" className="flex-col h-auto py-2.5 gap-1"><QrCode className="h-4 w-4" /><span className="text-[10px]">QRIS</span></Button>
                  </div>
                  <Button className="w-full h-11 text-sm gap-2" disabled={cart.length === 0}>
                    <ShoppingCart className="h-4 w-4" /> Proses Pembayaran
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── INVENTORY TAB ────────────────── */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{products.length} total produk · {products.filter(p => p.status === "synced").length} tersinkron</span>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs"><RefreshCw className="h-3 w-3" /> Sync Semua</Button>
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
                      <tr key={p.sku} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={p.img} alt={p.name} className="h-9 w-9 rounded-lg object-cover" />
                            <span className="font-medium">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{p.sku}</td>
                        <td className="py-3 px-4 text-right font-medium">{formatRp(p.price)}</td>
                        <td className="py-3 px-4 text-right">{p.stock}</td>
                        <td className="py-3 px-4 text-right">{p.online}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={p.status === "synced" ? "default" : p.status === "syncing" ? "secondary" : "destructive"} className="text-[10px]">
                            {p.status === "synced" ? "✓ Synced" : p.status === "syncing" ? "⟳ Syncing" : "✕ Habis"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Eye className="h-3.5 w-3.5" /></Button>
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
