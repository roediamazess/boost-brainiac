import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Store, ShoppingCart, Package, RefreshCw, Search,
  Star, Plus, Minus, Trash2, CreditCard, Banknote, QrCode,
  BarChart3, ArrowUpRight, Eye, ShoppingBag, Smartphone,
  Copy, Check, ExternalLink, Users, Percent, Link as LinkIcon,
  Settings, ArrowUpDown, Pencil, Trash, FolderPlus, PackagePlus,
} from "lucide-react";
import {
  products as initialProducts, ownerStore, resellerStores, formatRp,
  type Product,
} from "@/data/store-data";

type CartItem = { id: number; qty: number };

type CategoryItem = {
  id: string;
  name: string;
  icon: string;
  channels: { webstore: boolean; reseller: boolean; pos: boolean };
};

const defaultCategories: CategoryItem[] = [
  { id: "Tops", name: "Atasan", icon: "👕", channels: { webstore: true, reseller: true, pos: true } },
  { id: "Bottoms", name: "Bawahan", icon: "👖", channels: { webstore: true, reseller: true, pos: true } },
  { id: "Accessories", name: "Aksesoris", icon: "🎒", channels: { webstore: true, reseller: true, pos: true } },
];
type SortOption = "default" | "price_asc" | "price_desc" | "bestseller" | "rating";

const sortLabels: Record<SortOption, string> = {
  default: "Default",
  price_asc: "Harga Terendah",
  price_desc: "Harga Tertinggi",
  bestseller: "Terlaris",
  rating: "Rating Tertinggi",
};

const sortProducts = (list: Product[], sort: SortOption): Product[] => {
  const sorted = [...list];
  switch (sort) {
    case "price_asc": return sorted.sort((a, b) => a.price - b.price);
    case "price_desc": return sorted.sort((a, b) => b.price - a.price);
    case "bestseller": return sorted.sort((a, b) => b.sold - a.sold);
    case "rating": return sorted.sort((a, b) => b.rating - a.rating);
    default: return sorted;
  }
};

const categoryLabel = (cat: string) => {
  const found = defaultCategories.find(c => c.id === cat);
  return found ? `${found.icon} ${found.name}` : cat === "Semua" ? "📦 Semua" : cat;
};

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
  const [storeSort, setStoreSort] = useState<SortOption>("default");
  const [posSort, setPosSort] = useState<SortOption>("default");

  // Data state
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categoryList, setCategoryList] = useState<CategoryItem[]>(defaultCategories);

  // Modal state
  const [productModal, setProductModal] = useState<{ open: boolean; editing: Product | null }>({ open: false, editing: null });
  const [categoryModal, setCategoryModal] = useState<{ open: boolean; editing: CategoryItem | null }>({ open: false, editing: null });

  // Product form state
  const [pForm, setPForm] = useState({ name: "", sku: "", price: "", stock: "", category: "", description: "" });
  // Category form state
  const [cForm, setCForm] = useState({ name: "", icon: "📦", webstore: true, reseller: true, pos: true });

  const openProductModal = (p?: Product) => {
    if (p) {
      setPForm({ name: p.name, sku: p.sku, price: String(p.price), stock: String(p.stock), category: p.category, description: p.description });
      setProductModal({ open: true, editing: p });
    } else {
      setPForm({ name: "", sku: "", price: "", stock: "", category: categoryList[0]?.id || "", description: "" });
      setProductModal({ open: true, editing: null });
    }
  };

  const saveProduct = () => {
    if (!pForm.name || !pForm.sku || !pForm.price) return;
    if (productModal.editing) {
      setProducts(prev => prev.map(p => p.id === productModal.editing!.id ? {
        ...p, name: pForm.name, sku: pForm.sku, price: Number(pForm.price), stock: Number(pForm.stock), category: pForm.category, description: pForm.description,
        online: Number(pForm.stock), status: Number(pForm.stock) > 0 ? "synced" as const : "out" as const,
      } : p));
    } else {
      const newP: Product = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        name: pForm.name, sku: pForm.sku, price: Number(pForm.price), stock: Number(pForm.stock),
        online: Number(pForm.stock), status: Number(pForm.stock) > 0 ? "synced" : "out",
        img: "", rating: 0, sold: 0, category: pForm.category, description: pForm.description,
      };
      setProducts(prev => [...prev, newP]);
    }
    setProductModal({ open: false, editing: null });
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const openCategoryModal = (c?: CategoryItem) => {
    if (c) {
      setCForm({ name: c.name, icon: c.icon, webstore: c.channels.webstore, reseller: c.channels.reseller, pos: c.channels.pos });
      setCategoryModal({ open: true, editing: c });
    } else {
      setCForm({ name: "", icon: "📦", webstore: true, reseller: true, pos: true });
      setCategoryModal({ open: true, editing: null });
    }
  };

  const saveCategory = () => {
    if (!cForm.name) return;
    if (categoryModal.editing) {
      setCategoryList(prev => prev.map(c => c.id === categoryModal.editing!.id ? {
        ...c, name: cForm.name, icon: cForm.icon, channels: { webstore: cForm.webstore, reseller: cForm.reseller, pos: cForm.pos },
      } : c));
    } else {
      const newId = cForm.name.replace(/\s+/g, "_");
      setCategoryList(prev => [...prev, { id: newId, name: cForm.name, icon: cForm.icon, channels: { webstore: cForm.webstore, reseller: cForm.reseller, pos: cForm.pos } }]);
    }
    setCategoryModal({ open: false, editing: null });
  };

  const deleteCategory = (id: string) => {
    setCategoryList(prev => prev.filter(c => c.id !== id));
  };

  const categories = ["Semua", ...categoryList.map(c => c.id)];

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

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "Semua" || p.category === selectedCategory)
    );
    return sortProducts(filtered, storeSort);
  }, [search, selectedCategory, storeSort, products]);

  const posFiltered = useMemo(() => {
    const filtered = products.filter(
      (p) =>
        p.stock > 0 &&
        (p.name.toLowerCase().includes(posSearch.toLowerCase()) ||
          p.sku.toLowerCase().includes(posSearch.toLowerCase())) &&
        (posCategory === "Semua" || p.category === posCategory)
    );
    return sortProducts(filtered, posSort);
  }, [posSearch, posCategory, posSort, products]);

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

  const SortSelect = ({ value, onChange }: { value: SortOption; onChange: (v: SortOption) => void }) => (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger className="w-[160px] h-8 text-xs">
        <ArrowUpDown className="h-3 w-3 mr-1.5" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(sortLabels).map(([k, v]) => (
          <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const CategoryChips = ({ selected, onSelect, showCount = false }: { selected: string; onSelect: (c: string) => void; showCount?: boolean }) => (
    <div className="flex items-center gap-2 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
            selected === cat
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          {categoryLabel(cat)}
          {showCount && (
            <span className="ml-1.5 text-[10px] opacity-70">
              {cat === "Semua" ? products.filter(p => p.status !== "out").length : products.filter(p => p.category === cat && p.status !== "out").length}
            </span>
          )}
        </button>
      ))}
    </div>
  );

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
        <TabsList className="h-11 p-1 flex-wrap">
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
          <TabsTrigger value="settings" className="gap-2 px-4">
            <Settings className="h-4 w-4" /> Pengaturan
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
                      <Button onClick={() => copyLink(ownerStore.slug)} className="gap-2 shrink-0">
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

          {/* Filters & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-sm">Produk di Webstore</h3>
              <Badge variant="secondary" className="text-xs">{filteredProducts.filter(p => p.status !== "out").length} aktif</Badge>
            </div>
            <SortSelect value={storeSort} onChange={setStoreSort} />
          </div>
          <CategoryChips selected={selectedCategory} onSelect={setSelectedCategory} showCount />

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {filteredProducts.filter(p => p.status !== "out").map((p) => (
              <Card key={p.id} className="overflow-hidden group">
                <div className="aspect-square overflow-hidden">
                  <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-3 space-y-1">
                  <p className="text-[10px] text-muted-foreground">{categoryLabel(p.category)}</p>
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
                    <button onClick={() => copyLink(rs.slug)} className="p-1 rounded hover:bg-muted transition-colors">
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
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Scan barcode atau cari produk / SKU..."
                    value={posSearch}
                    onChange={(e) => setPosSearch(e.target.value)}
                    className="pl-9 h-12 text-base"
                  />
                </div>
                <SortSelect value={posSort} onChange={setPosSort} />
              </div>
              <CategoryChips selected={posCategory} onSelect={setPosCategory} />
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
                      <th className="text-left py-3 px-4 font-medium">Kategori</th>
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
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-[10px]">{categoryLabel(p.category)}</Badge>
                        </td>
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

        {/* ─── SETTINGS TAB ──────────────────── */}
        <TabsContent value="settings" className="space-y-6">
          {/* Category Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><FolderPlus className="h-4 w-4 text-muted-foreground" /> Manajemen Kategori</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Kelola kategori produk untuk webstore, reseller, dan POS.</p>
              </div>
              <Button size="sm" className="gap-1.5" onClick={() => openCategoryModal()}>
                <Plus className="h-3.5 w-3.5" /> Tambah Kategori
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryList.map((cat) => {
                const count = products.filter(p => p.category === cat.id).length;
                const activeCount = products.filter(p => p.category === cat.id && p.status !== "out").length;
                return (
                  <Card key={cat.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{cat.icon}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{cat.name}</h4>
                            <p className="text-[10px] text-muted-foreground">{count} produk · {activeCount} aktif</p>
                          </div>
                        </div>
                        <Badge variant="default" className="text-[10px]">Aktif</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span>📦 Stok: {products.filter(p => p.category === cat.id).reduce((s, p) => s + p.stock, 0)}</span>
                        <span>🛒 Terjual: {products.filter(p => p.category === cat.id).reduce((s, p) => s + p.sold, 0)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {cat.channels.webstore && <Badge variant="outline" className="text-[10px] gap-1"><Store className="h-2.5 w-2.5" /> Webstore</Badge>}
                        {cat.channels.reseller && <Badge variant="outline" className="text-[10px] gap-1"><Users className="h-2.5 w-2.5" /> Reseller</Badge>}
                        {cat.channels.pos && <Badge variant="outline" className="text-[10px] gap-1"><ShoppingCart className="h-2.5 w-2.5" /> POS</Badge>}
                      </div>
                      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t">
                        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs flex-1" onClick={() => openCategoryModal(cat)}><Pencil className="h-3 w-3" /> Edit</Button>
                        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-destructive hover:text-destructive" onClick={() => deleteCategory(cat.id)}><Trash className="h-3 w-3" /> Hapus</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Product Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><PackagePlus className="h-4 w-4 text-muted-foreground" /> Manajemen Produk</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Tambah, edit, atau hapus produk yang ditampilkan di semua channel.</p>
              </div>
              <Button size="sm" className="gap-1.5" onClick={() => openProductModal()}>
                <Plus className="h-3.5 w-3.5" /> Tambah Produk
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
                        <th className="text-left py-3 px-4 font-medium">Kategori</th>
                        <th className="text-right py-3 px-4 font-medium">Harga</th>
                        <th className="text-right py-3 px-4 font-medium">Stok</th>
                        <th className="text-center py-3 px-4 font-medium">Channel</th>
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
                              <div>
                                <span className="font-medium text-sm">{p.name}</span>
                                <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{p.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{p.sku}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-[10px]">{categoryLabel(p.category)}</Badge>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">{formatRp(p.price)}</td>
                          <td className="py-3 px-4 text-right">{p.stock}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1">
                              <Badge variant="secondary" className="text-[9px] px-1.5">Web</Badge>
                              <Badge variant="secondary" className="text-[9px] px-1.5">POS</Badge>
                              <Badge variant="secondary" className="text-[9px] px-1.5">Reseller</Badge>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant={p.status === "synced" ? "default" : p.status === "syncing" ? "secondary" : "destructive"} className="text-[10px]">
                              {p.status === "synced" ? "✓ Aktif" : p.status === "syncing" ? "⟳ Sync" : "✕ Habis"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openProductModal(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => deleteProduct(p.id)}><Trash className="h-3.5 w-3.5" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── PRODUCT MODAL ─────────────────── */}
      <Dialog open={productModal.open} onOpenChange={(o) => !o && setProductModal({ open: false, editing: null })}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{productModal.editing ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
            <DialogDescription>
              {productModal.editing ? "Perbarui informasi produk." : "Isi detail produk untuk ditambahkan ke semua channel."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Nama Produk *</Label>
                <Input placeholder="Kaos Polos Premium" value={pForm.name} onChange={(e) => setPForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">SKU *</Label>
                <Input placeholder="KPP-001" value={pForm.sku} onChange={(e) => setPForm(f => ({ ...f, sku: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Harga (Rp) *</Label>
                <Input type="number" placeholder="89000" value={pForm.price} onChange={(e) => setPForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Stok</Label>
                <Input type="number" placeholder="100" value={pForm.stock} onChange={(e) => setPForm(f => ({ ...f, stock: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Kategori</Label>
              <Select value={pForm.category} onValueChange={(v) => setPForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                <SelectContent>
                  {categoryList.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Deskripsi</Label>
              <Textarea placeholder="Deskripsi singkat produk..." value={pForm.description} onChange={(e) => setPForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductModal({ open: false, editing: null })}>Batal</Button>
            <Button onClick={saveProduct} disabled={!pForm.name || !pForm.sku || !pForm.price}>
              {productModal.editing ? "Simpan Perubahan" : "Tambah Produk"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── CATEGORY MODAL ────────────────── */}
      <Dialog open={categoryModal.open} onOpenChange={(o) => !o && setCategoryModal({ open: false, editing: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{categoryModal.editing ? "Edit Kategori" : "Tambah Kategori Baru"}</DialogTitle>
            <DialogDescription>
              {categoryModal.editing ? "Perbarui informasi kategori." : "Buat kategori baru untuk mengelompokkan produk."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Icon</Label>
                <Input value={cForm.icon} onChange={(e) => setCForm(f => ({ ...f, icon: e.target.value }))} className="text-center text-lg" maxLength={2} />
              </div>
              <div className="col-span-3 space-y-1.5">
                <Label className="text-xs font-medium">Nama Kategori *</Label>
                <Input placeholder="Aksesoris" value={cForm.name} onChange={(e) => setCForm(f => ({ ...f, name: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">Tampilkan di Channel</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={cForm.webstore} onCheckedChange={(v) => setCForm(f => ({ ...f, webstore: !!v }))} />
                  <Store className="h-3.5 w-3.5" /> Webstore
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={cForm.reseller} onCheckedChange={(v) => setCForm(f => ({ ...f, reseller: !!v }))} />
                  <Users className="h-3.5 w-3.5" /> Reseller
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={cForm.pos} onCheckedChange={(v) => setCForm(f => ({ ...f, pos: !!v }))} />
                  <ShoppingCart className="h-3.5 w-3.5" /> POS
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryModal({ open: false, editing: null })}>Batal</Button>
            <Button onClick={saveCategory} disabled={!cForm.name}>
              {categoryModal.editing ? "Simpan Perubahan" : "Tambah Kategori"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
