export const serviceOrderStatuses = [
  "New Request",
  "Waiting Review",
  "Quotation Sent",
  "Customer Approved",
  "Waiting Item Drop Off",
  "In Progress",
  "Waiting Parts",
  "Ready For Collection",
  "Completed",
  "Cancelled"
] as const;

export const storeRequestStatuses = [
  "New Request",
  "Under Review",
  "Approved",
  "Rejected",
  "Waiting Stock",
  "Processing",
  "Sent Out",
  "Received by Store",
  "Completed"
] as const;

export const roles = [
  "store_staff",
  "store_manager",
  "service_admin",
  "inventory_admin",
  "super_admin"
] as const;

export type Role = (typeof roles)[number];
export type ServiceOrderStatus = (typeof serviceOrderStatuses)[number];
export type StoreRequestStatus = (typeof storeRequestStatuses)[number];

export type Permission =
  | "service:create"
  | "service:review"
  | "service:quote"
  | "service:update_status"
  | "service:view_all"
  | "store_request:create"
  | "store_request:approve"
  | "store_request:fulfill"
  | "inventory:view"
  | "inventory:update"
  | "admin:manage_users";

export type ServiceOrder = {
  id: string;
  orderNo: string;
  customerName: string;
  storeName: string;
  serviceType: string;
  status: ServiceOrderStatus;
  paymentStatus: string;
  quotationAmount: number;
  updatedAt: string;
};

export type StoreRequest = {
  id: string;
  requestNo: string;
  requestType: string;
  storeName: string;
  status: StoreRequestStatus;
  priority: "low" | "normal" | "urgent";
  itemCount: number;
  updatedAt: string;
};

export type InventoryRow = {
  storeName: string;
  sku: string;
  productName: string;
  onHand: number;
  reserved: number;
  reorderLevel: number;
};
