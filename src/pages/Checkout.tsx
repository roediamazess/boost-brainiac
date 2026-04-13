import { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, Store, MapPin, Truck, Clock, Zap, Package,
  CreditCard, Banknote, QrCode, Smartphone, Shield,
  CheckCircle2, ChevronRight, MessageCircle, AlertCircle,
} from "lucide-react";
import {
  products, allStores, formatRp, getStorePrice, type Product,
} from "@/data/store-data";

type CartItem = { id: number; qty: number };

type ShippingOption = {
  id: string;
  name: string;
  courier: string;
  type: string;
  price: number;
  eta: string;
  icon: React.ElementType;
  popular?: boolean;
};

const shippingOptions: ShippingOption[] = [
  { id: "gosend-instant", name: "GoSend Instant", courier: "Gojek", type: "Instant", price: 25000, eta: "1-2 jam", icon: Zap, popular: true },
  { id: "grab-instant", name: "GrabExpress Instant", courier: "Grab", type: "Instant", price: 23000, eta: "1-2 jam", icon: Zap },
  { id: "gosend-sameday", name: "GoSend Same Day", courier: "Gojek", type: "Same Day", price: 15000, eta: "6-8 jam", icon: Clock },
  { id: "grab-sameday", name: "GrabExpress Same Day", courier: "Grab", type: "Same Day", price: 14000, eta: "6-8 jam", icon: Clock },
  { id: "jne-reg", name: "JNE Reguler (REG)", courier: "JNE", type: "Reguler", price: 11000, eta: "2-3 hari", icon: Truck, popular: true },
  { id: "jnt-ez", name: "J&T Express EZ", courier: "J&T", type: "Reguler", price: 10000, eta: "2-3 hari", icon: Truck },
  { id: "sicepat-reg", name: "SiCepat REG", courier: "SiCepat", type: "Reguler", price: 10000, eta: "2-3 hari", icon: Truck },
  { id: "anteraja-reg", name: "AnterAja Reguler", courier: "AnterAja", type: "Reguler", price: 9500, eta: "2-4 hari", icon: Truck },
  { id: "jne-oke", name: "JNE OKE (Ekonomi)", courier: "JNE", type: "Ekonomi", price: 8000, eta: "3-5 hari", icon: Package },
  { id: "jnt-eco", name: "J&T Eco", courier: "J&T", type: "Ekonomi", price: 7500, eta: "3-6 hari", icon: Package },
  { id: "id-express", name: "ID Express Standard", courier: "ID Express", type: "Reguler", price: 9000, eta: "2-4 hari", icon: Truck },
  { id: "ninja-reg", name: "Ninja Xpress Standard", courier: "Ninja", type: "Reguler", price: 10000, eta: "2-3 hari", icon: Truck },
];

const shippingCategories = ["Instant", "Same Day", "Reguler", "Ekonomi"];

type PaymentMethod = { id: string; name: string; icon: React.ElementType; desc: string };
const paymentMethods: PaymentMethod[] = [
  { id: "qris", name: "QRIS", icon: QrCode, desc: "GoPay, OVO, DANA, ShopeePay, dll" },
  { id: "va-bca", name: "Transfer Bank (VA)", icon: CreditCard, desc: "BCA, BNI, BRI, Mandiri, Permata" },
  { id: "ewallet", name: "E-Wallet", icon: Smartphone, desc: "GoPay, OVO, DANA, LinkAja" },
  { id: "cod", name: "COD (Bayar di Tempat)", icon: Banknote, desc: "Bayar saat barang sampai" },
];

export default function Checkout() {
  const { storeName } = useParams<{ storeName: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const store = allStores.find((s) => s.slug === storeName);

  const cartItems: CartItem[] = (location.state as any)?.cart ?? [];
  const price = (p: Product) => getStorePrice(p.price, store?.markup ?? 0);

  const [step, setStep] = useState(1); // 1=address, 2=shipping, 3=payment, 4=confirm
  const [form, setForm] = useState({
    name: "", phone: "", province: "", city: "", district: "", postalCode: "", address: "", notes: "",
  });
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [shippingFilter, setShippingFilter] = useState<string>("all");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const updateForm = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const subtotal = cartItems.reduce((s, ci) => {
    const p = products.find((pr) => pr.id === ci.id);
    return s + (p ? price(p) * ci.qty : 0);
  }, 0);
  const shipping = shippingOptions.find((s) => s.id === selectedShipping);
  const shippingCost = shipping?.price ?? 0;
  const total = subtotal + shippingCost;
  const itemCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const isAddressValid = form.name && form.phone && form.city && form.address;
  const filteredShipping = shippingFilter === "all"
    ? shippingOptions
    : shippingOptions.filter((s) => s.type === shippingFilter);

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <Store className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Toko tidak ditemukan</h1>
        <Link to="/"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" /> Kembali</Button></Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-xl font-bold mb-2">Keranjang Kosong</h1>
        <p className="text-sm text-muted-foreground mb-6">Tambahkan produk terlebih dahulu sebelum checkout.</p>
        <Button onClick={() => navigate(`/store/${storeName}`)}><ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Toko</Button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-5 animate-fade-in">
          <div className="mx-auto h-20 w-20 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold">Pesanan Berhasil! 🎉</h1>
          <p className="text-muted-foreground text-sm">Terima kasih telah berbelanja di <strong>{store.name}</strong>. Detail pesanan telah dikirim ke WhatsApp Anda.</p>
          <Card>
            <CardContent className="p-4 space-y-2 text-sm text-left">
              <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span><span className="font-mono font-medium">ORD-{Date.now().toString(36).toUpperCase()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-bold text-primary">{formatRp(total)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pengiriman</span><span>{shipping?.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Estimasi</span><span>{shipping?.eta}</span></div>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-2">
            <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer">
              <Button className="w-full gap-2"><MessageCircle className="h-4 w-4" /> Hubungi Penjual</Button>
            </a>
            <Button variant="outline" onClick={() => navigate(`/store/${storeName}`)} className="w-full">
              Kembali ke Toko
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate(`/store/${storeName}`)} className="p-2 -ml-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="font-bold text-sm flex-1">Checkout</h1>
          <Badge variant="secondary" className="text-[10px]">{store.name}</Badge>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center gap-1">
          {[
            { n: 1, label: "Alamat" },
            { n: 2, label: "Pengiriman" },
            { n: 3, label: "Pembayaran" },
            { n: 4, label: "Konfirmasi" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              <div className={`flex items-center gap-1.5 ${step >= s.n ? "text-primary" : "text-muted-foreground"}`}>
                <span className={`h-7 w-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                  step > s.n ? "bg-primary text-primary-foreground" : step === s.n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {step > s.n ? "✓" : s.n}
                </span>
                <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
              </div>
              {i < 3 && <div className={`flex-1 h-0.5 mx-2 rounded ${step > s.n ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-4">
            {/* STEP 1: Address */}
            {step === 1 && (
              <Card className="animate-fade-in">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h2 className="font-semibold">Alamat Pengiriman</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Nama Lengkap *</Label>
                      <Input placeholder="Nama penerima" value={form.name} onChange={(e) => updateForm("name", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">No. HP / WhatsApp *</Label>
                      <Input placeholder="08xxxxxxxxxx" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Provinsi</Label>
                      <Input placeholder="DKI Jakarta" value={form.province} onChange={(e) => updateForm("province", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Kota / Kabupaten *</Label>
                      <Input placeholder="Jakarta Selatan" value={form.city} onChange={(e) => updateForm("city", e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Kecamatan</Label>
                      <Input placeholder="Kebayoran Baru" value={form.district} onChange={(e) => updateForm("district", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Kode Pos</Label>
                      <Input placeholder="12120" value={form.postalCode} onChange={(e) => updateForm("postalCode", e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Alamat Lengkap *</Label>
                    <Textarea placeholder="Jl. Sudirman No. 123, RT 01/RW 02, Blok A..." value={form.address} onChange={(e) => updateForm("address", e.target.value)} rows={3} />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Catatan untuk Kurir</Label>
                    <Input placeholder="Lantai 3, pintu warna biru, dll." value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} />
                  </div>

                  <Button className="w-full h-11 gap-2" disabled={!isAddressValid} onClick={() => setStep(2)}>
                    Lanjut ke Pengiriman <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* STEP 2: Shipping */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <Card>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="h-4 w-4 text-primary" />
                      <h2 className="font-semibold">Pilih Pengiriman</h2>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setShippingFilter("all")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${shippingFilter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                      >
                        Semua
                      </button>
                      {shippingCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setShippingFilter(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${shippingFilter === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      {filteredShipping.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedShipping(opt.id)}
                          className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                            selectedShipping === opt.id
                              ? "border-primary bg-accent/50 ring-1 ring-primary/20"
                              : "border-border hover:border-primary/30 hover:bg-muted/30"
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 ${
                            opt.type === "Instant" ? "bg-warning/10 text-warning" :
                            opt.type === "Same Day" ? "bg-info/10 text-info" :
                            opt.type === "Ekonomi" ? "bg-muted text-muted-foreground" :
                            "bg-primary/10 text-primary"
                          }`}>
                            <opt.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{opt.name}</span>
                              {opt.popular && <Badge className="text-[8px] h-4 px-1.5 bg-warning/10 text-warning border-0">Populer</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Estimasi: {opt.eta}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold">{formatRp(opt.price)}</p>
                            <Badge variant="secondary" className="text-[9px] mt-0.5">{opt.type}</Badge>
                          </div>
                          <div className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                            selectedShipping === opt.id ? "border-primary bg-primary" : "border-muted-foreground/30"
                          }`}>
                            {selectedShipping === opt.id && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
                          </div>
                        </button>
                      ))}
                    </div>

                    <Button className="w-full h-11 gap-2" disabled={!selectedShipping} onClick={() => setStep(3)}>
                      Lanjut ke Pembayaran <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <Card className="animate-fade-in">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <h2 className="font-semibold">Metode Pembayaran</h2>
                  </div>

                  <div className="space-y-2">
                    {paymentMethods.map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => setSelectedPayment(pm.id)}
                        className={`w-full flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all ${
                          selectedPayment === pm.id
                            ? "border-primary bg-accent/50 ring-1 ring-primary/20"
                            : "border-border hover:border-primary/30 hover:bg-muted/30"
                        }`}
                      >
                        <div className="p-2.5 rounded-lg bg-muted shrink-0">
                          <pm.icon className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{pm.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{pm.desc}</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                          selectedPayment === pm.id ? "border-primary bg-primary" : "border-muted-foreground/30"
                        }`}>
                          {selectedPayment === pm.id && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/50 border border-primary/10">
                    <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">Transaksi Anda dilindungi. Data pembayaran dienkripsi dan aman.</p>
                  </div>

                  <Button className="w-full h-11 gap-2" disabled={!selectedPayment} onClick={() => setStep(4)}>
                    Tinjau Pesanan <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* STEP 4: Confirmation */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                {/* Address summary */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold">Alamat Pengiriman</h3>
                      </div>
                      <button onClick={() => setStep(1)} className="text-xs text-primary font-medium hover:underline">Ubah</button>
                    </div>
                    <div className="text-sm space-y-0.5">
                      <p className="font-medium">{form.name} · {form.phone}</p>
                      <p className="text-muted-foreground">{form.address}</p>
                      <p className="text-muted-foreground">{[form.district, form.city, form.province, form.postalCode].filter(Boolean).join(", ")}</p>
                      {form.notes && <p className="text-xs text-muted-foreground italic mt-1">📝 {form.notes}</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping summary */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold">Pengiriman</h3>
                      </div>
                      <button onClick={() => setStep(2)} className="text-xs text-primary font-medium hover:underline">Ubah</button>
                    </div>
                    {shipping && (
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium">{shipping.name}</p>
                          <p className="text-xs text-muted-foreground">Estimasi: {shipping.eta}</p>
                        </div>
                        <p className="font-bold">{formatRp(shipping.price)}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment summary */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold">Pembayaran</h3>
                      </div>
                      <button onClick={() => setStep(3)} className="text-xs text-primary font-medium hover:underline">Ubah</button>
                    </div>
                    {selectedPayment && (
                      <p className="text-sm font-medium">
                        {paymentMethods.find((pm) => pm.id === selectedPayment)?.name}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Items */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-sm font-semibold">Produk ({itemCount} item)</h3>
                    <div className="divide-y">
                      {cartItems.map((ci) => {
                        const p = products.find((pr) => pr.id === ci.id);
                        if (!p) return null;
                        return (
                          <div key={ci.id} className="flex items-center gap-3 py-2.5">
                            <img src={p.img} alt={p.name} className="h-12 w-12 rounded-lg object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{ci.qty}x {formatRp(price(p))}</p>
                            </div>
                            <p className="text-sm font-semibold shrink-0">{formatRp(price(p) * ci.qty)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full h-12 gap-2 text-sm" onClick={() => setOrderPlaced(true)}>
                  <CheckCircle2 className="h-4 w-4" /> Bayar {formatRp(total)}
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 space-y-3">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Ringkasan Pesanan</h3>
                  <div className="divide-y">
                    {cartItems.map((ci) => {
                      const p = products.find((pr) => pr.id === ci.id);
                      if (!p) return null;
                      return (
                        <div key={ci.id} className="flex items-center gap-2.5 py-2">
                          <img src={p.img} alt={p.name} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{p.name}</p>
                            <p className="text-[11px] text-muted-foreground">{ci.qty}x</p>
                          </div>
                          <p className="text-xs font-semibold shrink-0">{formatRp(price(p) * ci.qty)}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="space-y-2 pt-2 border-t text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({itemCount} item)</span>
                      <span>{formatRp(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ongkos Kirim</span>
                      <span>{shipping ? formatRp(shippingCost) : "—"}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t text-base">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary">{formatRp(total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {shipping && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-accent/50 border border-primary/10">
                  <Truck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <p className="font-medium">{shipping.name}</p>
                    <p className="text-muted-foreground">Estimasi tiba: {shipping.eta}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
