import { AppShell } from "@/components/app-shell";
import { Badge, Card } from "@/components/ui";
import { inventoryRows } from "@/lib/mock-data";

export default function InventoryPage() {
  return (
    <AppShell>
      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Inventory Tracking by Store</h3>
            <p className="mt-1 text-sm text-moss">Store-level stock, reserved quantity, and low stock alert thresholds.</p>
          </div>
          <Badge tone="warn">Auto alert when on hand {"<="} reorder level</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-black/10 text-xs uppercase tracking-wide text-moss">
              <tr>
                <th className="py-3">Store</th>
                <th>SKU</th>
                <th>Product</th>
                <th>On hand</th>
                <th>Reserved</th>
                <th>Reorder level</th>
                <th>Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {inventoryRows.map((row) => {
                const isLow = row.onHand <= row.reorderLevel;
                return (
                  <tr key={`${row.storeName}-${row.sku}`}>
                    <td className="py-3 font-medium">{row.storeName}</td>
                    <td>{row.sku}</td>
                    <td>{row.productName}</td>
                    <td>{row.onHand}</td>
                    <td>{row.reserved}</td>
                    <td>{row.reorderLevel}</td>
                    <td><Badge tone={isLow ? "danger" : "good"}>{isLow ? "Low stock" : "Healthy"}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
