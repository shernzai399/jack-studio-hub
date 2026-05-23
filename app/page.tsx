import { AlertTriangle, ClipboardCheck, PackageCheck, WalletCards } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge, Card } from "@/components/ui";
import { inventoryRows, serviceOrders, storeRequests } from "@/lib/mock-data";

const metrics = [
  { label: "Open service orders", value: "42", icon: ClipboardCheck },
  { label: "Pending HQ approvals", value: "18", icon: PackageCheck },
  { label: "Low stock alerts", value: "9", icon: AlertTriangle },
  { label: "Awaiting payment", value: "RM 2,840", icon: WalletCards }
];

export default function DashboardPage() {
  const lowStock = inventoryRows.filter((row) => row.onHand <= row.reorderLevel);

  return (
    <AppShell>
      <div className="grid gap-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-moss">{metric.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-ink">{metric.value}</p>
                  </div>
                  <div className="grid size-11 place-items-center rounded-md bg-linen text-clay">
                    <Icon aria-hidden size={22} />
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">Service Module</h3>
              <Badge tone="warn">Hub review queue</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-black/10 text-xs uppercase tracking-wide text-moss">
                  <tr>
                    <th className="py-3">Order</th>
                    <th>Customer</th>
                    <th>Store</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {serviceOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-3 font-medium">{order.orderNo}</td>
                      <td>{order.customerName}</td>
                      <td>{order.storeName}</td>
                      <td>{order.serviceType}</td>
                      <td><Badge>{order.status}</Badge></td>
                      <td>{order.paymentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Low Stock</h3>
              <Badge tone="danger">{lowStock.length} alerts</Badge>
            </div>
            <div className="grid gap-3">
              {lowStock.map((row) => (
                <div key={`${row.storeName}-${row.sku}`} className="rounded-md border border-red-100 bg-red-50 p-3">
                  <p className="font-medium text-red-950">{row.productName}</p>
                  <p className="mt-1 text-sm text-red-800">
                    {row.storeName} has {row.onHand} on hand. Reorder level: {row.reorderLevel}.
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Store Operation Module</h3>
            <Badge tone="good">Workflow active</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-black/10 text-xs uppercase tracking-wide text-moss">
                <tr>
                  <th className="py-3">Request</th>
                  <th>Type</th>
                  <th>Store</th>
                  <th>Items</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {storeRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="py-3 font-medium">{request.requestNo}</td>
                    <td>{request.requestType}</td>
                    <td>{request.storeName}</td>
                    <td>{request.itemCount}</td>
                    <td>{request.priority}</td>
                    <td><Badge>{request.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
