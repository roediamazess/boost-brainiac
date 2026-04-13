import { products, formatRp } from "./store-data";

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type TrackingEvent = {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string;
  location?: string;
};

export type Order = {
  id: string;
  storeName: string;
  storeSlug: string;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  items: { productId: number; qty: number; price: number }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: string;
  shippingCourier: string;
  trackingNumber: string | null;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "expired" | "refunded";
  status: OrderStatus;
  trackingEvents: TrackingEvent[];
  createdAt: string;
  estimatedDelivery: string;
};

export const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  pending_payment: { label: "Menunggu Pembayaran", color: "text-warning", bgColor: "bg-warning/10" },
  paid: { label: "Dibayar", color: "text-info", bgColor: "bg-info/10" },
  processing: { label: "Diproses", color: "text-primary", bgColor: "bg-primary/10" },
  shipped: { label: "Dikirim", color: "text-primary", bgColor: "bg-primary/10" },
  in_transit: { label: "Dalam Perjalanan", color: "text-info", bgColor: "bg-info/10" },
  out_for_delivery: { label: "Sedang Diantar", color: "text-warning", bgColor: "bg-warning/10" },
  delivered: { label: "Terkirim", color: "text-success", bgColor: "bg-success/10" },
  cancelled: { label: "Dibatalkan", color: "text-destructive", bgColor: "bg-destructive/10" },
};

export const mockOrders: Order[] = [
  {
    id: "ORD-2026041301",
    storeName: "UrbanStyle Indonesia",
    storeSlug: "urbanstyle-id",
    customerName: "Budi Santoso",
    customerPhone: "081234567890",
    address: "Jl. Sudirman No. 123, RT 01/RW 02, Kebayoran Baru",
    city: "Jakarta Selatan, DKI Jakarta 12120",
    items: [
      { productId: 1, qty: 2, price: 89000 },
      { productId: 3, qty: 1, price: 185000 },
    ],
    subtotal: 363000,
    shippingCost: 15000,
    total: 378000,
    shippingMethod: "GoSend Same Day",
    shippingCourier: "Gojek",
    trackingNumber: "GK-2026041300123",
    paymentMethod: "QRIS",
    paymentStatus: "paid",
    status: "out_for_delivery",
    estimatedDelivery: "13 Apr 2026, 18:00",
    createdAt: "2026-04-13T08:30:00",
    trackingEvents: [
      { status: "pending_payment", label: "Pesanan Dibuat", description: "Menunggu pembayaran via QRIS", timestamp: "13 Apr 2026, 08:30" },
      { status: "paid", label: "Pembayaran Diterima", description: "Pembayaran QRIS berhasil diverifikasi", timestamp: "13 Apr 2026, 08:32" },
      { status: "processing", label: "Sedang Diproses", description: "Penjual sedang menyiapkan pesanan Anda", timestamp: "13 Apr 2026, 09:15", location: "Gudang UrbanStyle, Jakarta" },
      { status: "shipped", label: "Pesanan Dikirim", description: "Paket diserahkan ke kurir GoSend", timestamp: "13 Apr 2026, 10:45", location: "Jakarta Selatan" },
      { status: "out_for_delivery", label: "Sedang Diantar", description: "Kurir sedang dalam perjalanan ke alamat Anda", timestamp: "13 Apr 2026, 14:20", location: "Kebayoran Baru, Jakarta Selatan" },
    ],
  },
  {
    id: "ORD-2026041202",
    storeName: "UrbanStyle Indonesia",
    storeSlug: "urbanstyle-id",
    customerName: "Maya Putri",
    customerPhone: "081345678901",
    address: "Jl. Gatot Subroto No. 45, Menteng Dalam",
    city: "Jakarta Selatan, DKI Jakarta 12870",
    items: [
      { productId: 5, qty: 3, price: 45000 },
      { productId: 4, qty: 1, price: 125000 },
    ],
    subtotal: 260000,
    shippingCost: 11000,
    total: 271000,
    shippingMethod: "JNE Reguler (REG)",
    shippingCourier: "JNE",
    trackingNumber: "JNE-1234567890",
    paymentMethod: "Transfer Bank (VA)",
    paymentStatus: "paid",
    status: "in_transit",
    estimatedDelivery: "15 Apr 2026",
    createdAt: "2026-04-12T14:20:00",
    trackingEvents: [
      { status: "pending_payment", label: "Pesanan Dibuat", description: "Menunggu pembayaran via VA BCA", timestamp: "12 Apr 2026, 14:20" },
      { status: "paid", label: "Pembayaran Diterima", description: "Transfer diterima via VA BCA", timestamp: "12 Apr 2026, 14:35" },
      { status: "processing", label: "Sedang Diproses", description: "Pesanan sedang dikemas", timestamp: "12 Apr 2026, 16:00", location: "Gudang UrbanStyle, Jakarta" },
      { status: "shipped", label: "Pesanan Dikirim", description: "Paket diserahkan ke JNE", timestamp: "12 Apr 2026, 17:30", location: "JNE Jakarta Selatan" },
      { status: "in_transit", label: "Dalam Perjalanan", description: "Paket sedang dalam proses pengiriman", timestamp: "13 Apr 2026, 06:00", location: "JNE Hub Cakung, Jakarta" },
    ],
  },
  {
    id: "ORD-2026041103",
    storeName: "Dewa Fashion Corner",
    storeSlug: "dewa-fashion",
    customerName: "Rizki Pratama",
    customerPhone: "081456789012",
    address: "Jl. Diponegoro No. 78, Citarum",
    city: "Bandung, Jawa Barat 40115",
    items: [
      { productId: 3, qty: 2, price: 212750 },
    ],
    subtotal: 425500,
    shippingCost: 10000,
    total: 435500,
    shippingMethod: "SiCepat REG",
    shippingCourier: "SiCepat",
    trackingNumber: "SCP-0098765432",
    paymentMethod: "E-Wallet (GoPay)",
    paymentStatus: "paid",
    status: "delivered",
    estimatedDelivery: "13 Apr 2026",
    createdAt: "2026-04-11T10:00:00",
    trackingEvents: [
      { status: "pending_payment", label: "Pesanan Dibuat", description: "Menunggu pembayaran GoPay", timestamp: "11 Apr 2026, 10:00" },
      { status: "paid", label: "Pembayaran Diterima", description: "Pembayaran GoPay berhasil", timestamp: "11 Apr 2026, 10:02" },
      { status: "processing", label: "Sedang Diproses", description: "Pesanan sedang dikemas", timestamp: "11 Apr 2026, 11:30", location: "Gudang UrbanStyle, Jakarta" },
      { status: "shipped", label: "Pesanan Dikirim", description: "Paket diserahkan ke SiCepat", timestamp: "11 Apr 2026, 14:00", location: "SiCepat Jakarta" },
      { status: "in_transit", label: "Dalam Perjalanan", description: "Paket transit di hub sorting", timestamp: "12 Apr 2026, 03:00", location: "SiCepat Hub Karawang" },
      { status: "out_for_delivery", label: "Sedang Diantar", description: "Kurir menuju alamat penerima", timestamp: "13 Apr 2026, 08:30", location: "SiCepat Bandung" },
      { status: "delivered", label: "Terkirim", description: "Paket diterima oleh Rizki Pratama", timestamp: "13 Apr 2026, 10:15", location: "Bandung" },
    ],
  },
  {
    id: "ORD-2026041304",
    storeName: "UrbanStyle Indonesia",
    storeSlug: "urbanstyle-id",
    customerName: "Sari Dewi",
    customerPhone: "081567890123",
    address: "Jl. Ahmad Yani No. 12",
    city: "Surabaya, Jawa Timur 60234",
    items: [
      { productId: 2, qty: 1, price: 65000 },
    ],
    subtotal: 65000,
    shippingCost: 0,
    total: 65000,
    shippingMethod: "COD",
    shippingCourier: "J&T Express",
    trackingNumber: null,
    paymentMethod: "COD (Bayar di Tempat)",
    paymentStatus: "pending",
    status: "pending_payment",
    estimatedDelivery: "—",
    createdAt: "2026-04-13T11:00:00",
    trackingEvents: [
      { status: "pending_payment", label: "Pesanan Dibuat", description: "Menunggu konfirmasi pembayaran COD", timestamp: "13 Apr 2026, 11:00" },
    ],
  },
  {
    id: "ORD-2026041005",
    storeName: "UrbanStyle Indonesia",
    storeSlug: "urbanstyle-id",
    customerName: "Tommy Liem",
    customerPhone: "081678901234",
    address: "Jl. Pemuda No. 55",
    city: "Semarang, Jawa Tengah 50132",
    items: [
      { productId: 1, qty: 5, price: 89000 },
      { productId: 5, qty: 2, price: 45000 },
    ],
    subtotal: 535000,
    shippingCost: 8000,
    total: 543000,
    shippingMethod: "JNE OKE (Ekonomi)",
    shippingCourier: "JNE",
    trackingNumber: "JNE-9876543210",
    paymentMethod: "Transfer Bank (VA)",
    paymentStatus: "paid",
    status: "delivered",
    estimatedDelivery: "12 Apr 2026",
    createdAt: "2026-04-10T09:00:00",
    trackingEvents: [
      { status: "pending_payment", label: "Pesanan Dibuat", description: "Menunggu pembayaran via VA BNI", timestamp: "10 Apr 2026, 09:00" },
      { status: "paid", label: "Pembayaran Diterima", description: "Transfer BNI diterima", timestamp: "10 Apr 2026, 09:20" },
      { status: "processing", label: "Sedang Diproses", description: "Pesanan dikemas", timestamp: "10 Apr 2026, 11:00", location: "Gudang UrbanStyle, Jakarta" },
      { status: "shipped", label: "Pesanan Dikirim", description: "Diserahkan ke JNE", timestamp: "10 Apr 2026, 15:00", location: "JNE Jakarta" },
      { status: "in_transit", label: "Dalam Perjalanan", description: "Transit sorting center", timestamp: "11 Apr 2026, 02:00", location: "JNE Hub Cirebon" },
      { status: "out_for_delivery", label: "Sedang Diantar", description: "Kurir menuju alamat tujuan", timestamp: "12 Apr 2026, 08:00", location: "JNE Semarang" },
      { status: "delivered", label: "Terkirim", description: "Diterima oleh Tommy Liem", timestamp: "12 Apr 2026, 11:30", location: "Semarang" },
    ],
  },
];
