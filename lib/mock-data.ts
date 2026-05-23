import type { InventoryRow, ServiceOrder, StoreRequest } from "@/lib/types";

export const stores = [
  "Aeon Bukit Tinggi",
  "Paradigm Mall",
  "Main Place",
  "Aeon Permas Jaya",
  "Aeon Seremban 2",
  "Aeon Bukit Indah",
  "Aeon Wangsa Maju",
  "Aeon Kulaijaya",
  "Berjaya Time Square",
  "Alamanda Shopping",
  "Sunway Carnival",
  "Mayang Mall",
  "East Coast Mall"
];

export const serviceOrders: ServiceOrder[] = [
  {
    id: "SO-1",
    orderNo: "JS-SVC-240081",
    customerName: "Alicia Tan",
    storeName: "Aeon Bukit Tinggi",
    serviceType: "Luggage repair",
    status: "Waiting Review",
    paymentStatus: "unpaid",
    quotationAmount: 0,
    updatedAt: "Today, 10:20"
  },
  {
    id: "SO-2",
    orderNo: "JS-SVC-240079",
    customerName: "Daniel Lim",
    storeName: "Paradigm Mall",
    serviceType: "Leather care",
    status: "Quotation Sent",
    paymentStatus: "deposit_paid",
    quotationAmount: 180,
    updatedAt: "Today, 09:45"
  },
  {
    id: "SO-3",
    orderNo: "JS-SVC-240073",
    customerName: "Priya Nair",
    storeName: "Main Place",
    serviceType: "Engraving",
    status: "Ready For Collection",
    paymentStatus: "paid",
    quotationAmount: 45,
    updatedAt: "Yesterday"
  }
];

export const storeRequests: StoreRequest[] = [
  {
    id: "SR-1",
    requestNo: "JS-REQ-240210",
    requestType: "Replenishment",
    storeName: "Aeon Permas Jaya",
    status: "Under Review",
    priority: "urgent",
    itemCount: 7,
    updatedAt: "Today, 11:05"
  },
  {
    id: "SR-2",
    requestNo: "JS-REQ-240206",
    requestType: "Stock transfer",
    storeName: "Aeon Bukit Indah",
    status: "Processing",
    priority: "normal",
    itemCount: 3,
    updatedAt: "Today, 08:30"
  },
  {
    id: "SR-3",
    requestNo: "JS-REQ-240198",
    requestType: "Special product",
    storeName: "Aeon Wangsa Maju",
    status: "Waiting Stock",
    priority: "normal",
    itemCount: 1,
    updatedAt: "Friday"
  }
];

export const inventoryRows: InventoryRow[] = [
  {
    storeName: "Aeon Bukit Tinggi",
    sku: "JS-LG-022",
    productName: "Carry-on wheel set",
    onHand: 2,
    reserved: 1,
    reorderLevel: 5
  },
  {
    storeName: "Aeon Permas Jaya",
    sku: "JS-LC-014",
    productName: "Premium leather balm",
    onHand: 12,
    reserved: 0,
    reorderLevel: 4
  },
  {
    storeName: "Main Place",
    sku: "JS-HC-107",
    productName: "Brass initial charm",
    onHand: 1,
    reserved: 0,
    reorderLevel: 6
  }
];
