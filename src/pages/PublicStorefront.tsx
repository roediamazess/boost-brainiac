import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart, Search, Star, Heart, Plus, Minus, Trash2,
  X, MessageCircle, Store, ArrowLeft, CheckCircle2,
} from "lucide-react";
import {
  products, allStores, formatRp, getStorePrice,
  type Product, type StoreInfo,
} from "@/data/store-data";

type CartItem = { id: number; qty: number };

export default function PublicStorefront() {
  const navigate = useNavigate();
  const { storeName } = useParams<{ storeName: string }>();
  const store = allStores.find((s) => s.slug === storeName);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const price = (p: Product) => getStorePrice(p.price, store?.markup ?? 0);

  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(products.map((p) => p.category)))],
    []
  );
  const availableProducts = useMemo(
    () => products.filter((p) => p.status !== "out"),
    []
  );
  const filtered = useMemo(
    () =>
      availableProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) &&
          (selectedCategory === "Semua" || p.category === selectedCategory)
      ),
    [search, selectedCategory, availableProducts]
  );

  const addToCart = (id: number) => {
    setCart((c) => {
      const ex = c.find((i) => i.id === id);
      return ex
        ? c.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { id, qty: 1 }];
    });
  };
  const updateQty = (id: number, d: number) =>
    setCart((c) =>
      c.map((i) => (i.id === id ? { ...i, qty: i.qty + d } : i)).filter((i) => i.qty > 0)
    );
  const removeItem = (id: number) => setCart((c) => c.filter((i) => i.id !== id));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, ci) => {
    const p = products.find((pr) => pr.id === ci.id);
    return s + (p ? price(p) * ci.qty : 0);
  }, 0);

  const whatsappCheckout = () => {
    if (!store) return;
    const items = cart
      .map((ci) => {
        const p = products.find((pr) => pr.id === ci.id);
        return p ? `• ${p.name} x${ci.qty} = ${formatRp(price(p) * ci.qty)}` : "";
      })
      .filter(Boolean)
      .join("\n");
    const msg = `Halo ${store.name}! 🛒\n\nSaya ingin order:\n${items}\n\nTotal: ${formatRp(cartTotal)}\n\nMohon info ongkir dan pembayaran. Terima kasih!`;
    window.open(
      `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
    setCheckoutDone(true);
    setTimeout(() => setCheckoutDone(false), 4000);
  };

  // ─── 404 ───
  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <Store className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Toko tidak ditemukan</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Link toko yang Anda akses tidak valid atau sudah tidak aktif.
        </p>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">{store.name}</h1>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {store.isReseller ? `by ${store.owner}` : "Official Store"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${store.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs hidden sm:flex">
                <MessageCircle className="h-4 w-4" /> Chat
              </Button>
            </a>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-xl hover:bg-muted transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/30 to-background border-b">
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <Badge variant="secondary" className="mb-3 text-xs">
            {store.isReseller ? "Reseller Partner" : "✓ Official Store"}
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{store.name}</h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
            {store.tagline}
          </p>
        </div>
      </section>

      {/* ─── SEARCH ─── */}
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* ─── PRODUCTS ─── */}
      <div className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div
                className="relative aspect-square overflow-hidden cursor-pointer"
                onClick={() => setSelectedProduct(p)}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-card/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </button>
                {p.sold > 1000 && (
                  <Badge className="absolute top-2 left-2 text-[9px] bg-warning text-warning-foreground">
                    Best Seller
                  </Badge>
                )}
              </div>
              <div className="p-3.5 space-y-1.5">
                <p className="text-[11px] text-muted-foreground">{p.category}</p>
                <h3
                  className="text-sm font-semibold leading-tight line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setSelectedProduct(p)}
                >
                  {p.name}
                </h3>
                <div className="flex items-center gap-1.5">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  <span className="text-xs font-medium">{p.rating}</span>
                  <span className="text-[10px] text-muted-foreground">
                    · {p.sold.toLocaleString()} terjual
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-sm font-bold text-primary">
                    {formatRp(price(p))}
                  </span>
                  <Button
                    size="sm"
                    className="h-8 w-8 p-0 rounded-xl"
                    onClick={() => addToCart(p.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Produk tidak ditemukan.</p>
          </div>
        )}
      </div>

      {/* ─── PRODUCT DETAIL MODAL ─── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-card w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="relative aspect-square sm:aspect-video overflow-hidden sm:rounded-t-2xl rounded-t-2xl">
              <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <Badge variant="secondary" className="text-[10px] mb-2">{selectedProduct.category}</Badge>
                <h2 className="text-lg font-bold">{selectedProduct.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  <span className="text-sm font-medium">{selectedProduct.rating}</span>
                  <span className="text-xs text-muted-foreground">· {selectedProduct.sold.toLocaleString()} terjual</span>
                </div>
              </div>
              <p className="text-xl font-bold text-primary">{formatRp(price(selectedProduct))}</p>
              <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
              <div className="flex gap-2">
                <Button className="flex-1 gap-2" onClick={() => { addToCart(selectedProduct.id); setSelectedProduct(null); setCartOpen(true); }}>
                  <ShoppingCart className="h-4 w-4" /> Tambah ke Keranjang
                </Button>
                <a href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(`Halo, saya tertarik dengan ${selectedProduct.name} (${formatRp(price(selectedProduct))}). Apakah masih tersedia?`)}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <MessageCircle className="h-4 w-4" /> Tanya
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── CART DRAWER ─── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex justify-end">
          <div className="bg-card w-full max-w-md h-full flex flex-col animate-slide-in-right shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" /> Keranjang
                <Badge variant="secondary" className="text-[10px]">{cartCount}</Badge>
              </h2>
              <button onClick={() => setCartOpen(false)} className="p-2 rounded-lg hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y">
              {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mb-3 opacity-30" />
                  <p className="text-sm">Keranjang kosong</p>
                </div>
              )}
              {cart.map((ci) => {
                const p = products.find((pr) => pr.id === ci.id);
                if (!p) return null;
                return (
                  <div key={ci.id} className="flex items-center gap-3 p-4">
                    <img src={p.img} alt={p.name} className="h-16 w-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-sm font-bold text-primary mt-0.5">{formatRp(price(p))}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQty(ci.id, -1)} className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">{ci.qty}</span>
                        <button onClick={() => updateQty(ci.id, 1)} className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatRp(price(p) * ci.qty)}</p>
                      <button onClick={() => removeItem(ci.id)} className="p-1.5 rounded-md hover:bg-destructive/10 mt-1">
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total ({cartCount} item)</span>
                  <span className="text-lg font-bold text-primary">{formatRp(cartTotal)}</span>
                </div>
                <Button
                  className="w-full h-12 gap-2 text-sm"
                  onClick={() => {
                    setCartOpen(false);
                    navigate(`/store/${storeName}/checkout`, { state: { cart } });
                  }}
                >
                  <ShoppingCart className="h-4 w-4" /> Checkout Sekarang
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-10 gap-2 text-xs"
                  onClick={whatsappCheckout}
                >
                  <MessageCircle className="h-4 w-4" /> Checkout via WhatsApp
                </Button>
                {checkoutDone && (
                  <div className="flex items-center gap-2 text-success text-sm justify-center animate-fade-in">
                    <CheckCircle2 className="h-4 w-4" /> Pesanan dikirim ke WhatsApp!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── FOOTER ─── */}
      <footer className="border-t bg-card">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-muted-foreground">
            {store.name} · Powered by AutoPilot AI
          </p>
        </div>
      </footer>

      {/* ─── FLOATING CART ─── */}
      {cartCount > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-30 bg-primary text-primary-foreground h-14 px-5 rounded-2xl shadow-lg flex items-center gap-2.5 hover:opacity-90 transition-opacity animate-scale-in"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="font-semibold text-sm">{formatRp(cartTotal)}</span>
          <span className="bg-primary-foreground/20 text-primary-foreground text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        </button>
      )}
    </div>
  );
}
