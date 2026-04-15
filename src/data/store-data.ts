import imgKaos from "@/assets/product-kaos.jpg";
import imgTotebag from "@/assets/product-totebag.jpg";
import imgHoodie from "@/assets/product-hoodie.jpg";
import imgJogger from "@/assets/product-jogger.jpg";
import imgCap from "@/assets/product-cap.jpg";
import imgFlannel from "@/assets/product-flannel.jpg";

export type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  online: number;
  status: "synced" | "syncing" | "out";
  img: string;
  rating: number;
  sold: number;
  category: string;
  description: string;
  channels: { webstore: boolean; reseller: boolean; pos: boolean };
};

export const products: Product[] = [
  { id: 1, name: "Kaos Polos Premium", sku: "KPP-001", price: 89000, stock: 142, online: 138, status: "synced", img: imgKaos, rating: 4.8, sold: 1240, category: "Tops", description: "Kaos polos berbahan cotton combed 30s, nyaman dan adem dipakai sehari-hari.", channels: { webstore: true, reseller: true, pos: true } },
  { id: 2, name: "Tote Bag Canvas", sku: "TBC-045", price: 65000, stock: 87, online: 87, status: "synced", img: imgTotebag, rating: 4.6, sold: 890, category: "Accessories", description: "Tote bag kanvas tebal dengan tali kulit sintetis, cocok untuk daily use.", channels: { webstore: true, reseller: true, pos: true } },
  { id: 3, name: "Hoodie Oversize", sku: "HOS-012", price: 185000, stock: 34, online: 31, status: "syncing", img: imgHoodie, rating: 4.9, sold: 2100, category: "Tops", description: "Hoodie oversize bahan fleece premium, hangat dan stylish.", channels: { webstore: true, reseller: true, pos: true } },
  { id: 4, name: "Celana Jogger", sku: "CJG-099", price: 125000, stock: 56, online: 56, status: "synced", img: imgJogger, rating: 4.5, sold: 760, category: "Bottoms", description: "Celana jogger bahan baby terry, elastis dan nyaman untuk aktivitas.", channels: { webstore: true, reseller: true, pos: true } },
  { id: 5, name: "Snapback Cap", sku: "SBC-023", price: 45000, stock: 210, online: 208, status: "synced", img: imgCap, rating: 4.3, sold: 1580, category: "Accessories", description: "Topi snapback bahan premium dengan gesper logam adjustable.", channels: { webstore: true, reseller: true, pos: true } },
  { id: 6, name: "Kemeja Flanel", sku: "KFL-077", price: 149000, stock: 0, online: 0, status: "out", img: imgFlannel, rating: 4.7, sold: 430, category: "Tops", description: "Kemeja flanel kotak-kotak bahan katun tebal, cocok untuk outdoor.", channels: { webstore: true, reseller: true, pos: true } },
];

export type StoreInfo = {
  slug: string;
  name: string;
  owner: string;
  logo?: string;
  whatsapp: string;
  tagline: string;
  isReseller: boolean;
  markup: number; // percentage markup for reseller
};

export const ownerStore: StoreInfo = {
  slug: "urbanstyle-id",
  name: "UrbanStyle Indonesia",
  owner: "Andi Rahmawan",
  whatsapp: "6281234567890",
  tagline: "Fashion streetwear berkualitas untuk semua.",
  isReseller: false,
  markup: 0,
};

export const resellerStores: StoreInfo[] = [
  { slug: "dewa-fashion", name: "Dewa Fashion Corner", owner: "Dewi Lestari", whatsapp: "6281345678901", tagline: "Pilihan fashion terbaik dari Dewa Fashion.", isReseller: true, markup: 15 },
  { slug: "rudi-store", name: "Rudi's Collection", owner: "Rudi Hermawan", whatsapp: "6281456789012", tagline: "Koleksi terkurasi untuk gaya Anda.", isReseller: true, markup: 10 },
  { slug: "citra-boutique", name: "Citra Boutique", owner: "Citra Kirana", whatsapp: "6281567890123", tagline: "Style premium, harga bersahabat.", isReseller: true, markup: 20 },
];

export const allStores = [ownerStore, ...resellerStores];

export const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

export const getStorePrice = (basePrice: number, markup: number) =>
  Math.round(basePrice * (1 + markup / 100));
