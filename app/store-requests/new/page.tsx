import { Plus, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, Field, PrimaryButton, inputClass } from "@/components/ui";
import { stores } from "@/lib/mock-data";
import { storeRequestStatuses } from "@/lib/types";

export default function NewStoreRequestPage() {
  return (
    <AppShell>
      <form className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <Card>
            <h3 className="mb-4 text-lg font-semibold">Store Operation Request</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Request type">
                <select className={inputClass} name="request_type">
                  <option value="replenishment">Replenishment request</option>
                  <option value="stock_transfer">Stock transfer request</option>
                  <option value="new_product">New product request</option>
                  <option value="backorder">Backorder request</option>
                  <option value="special_product">Special product request</option>
                </select>
              </Field>
              <Field label="Priority">
                <select className={inputClass} name="priority">
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="low">Low</option>
                </select>
              </Field>
              <Field label="Requesting store">
                <select className={inputClass} name="from_store_id">
                  {stores.map((store) => (
                    <option key={store}>{store}</option>
                  ))}
                </select>
              </Field>
              <Field label="Destination / transfer store">
                <select className={inputClass} name="to_store_id">
                  {stores.map((store) => (
                    <option key={store}>{store}</option>
                  ))}
                </select>
              </Field>
              <div className="md:col-span-2">
                <Field label="Business reason">
                  <textarea className={inputClass} name="reason" rows={4} placeholder="Customer demand, low stock, campaign need, product issue, or urgent transfer reason" />
                </Field>
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">Request Items</h3>
              <button type="button" className="inline-flex min-h-9 items-center gap-2 rounded-md border border-black/15 px-3 text-sm font-medium">
                <Plus size={16} />
                Add item
              </button>
            </div>
            <div className="grid gap-3">
              {[1, 2, 3].map((row) => (
                <div key={row} className="grid gap-3 rounded-md border border-black/10 p-3 md:grid-cols-[1fr_1.5fr_120px]">
                  <Field label="SKU">
                    <input className={inputClass} name={`items.${row}.sku`} placeholder="JS-..." />
                  </Field>
                  <Field label="Product name">
                    <input className={inputClass} name={`items.${row}.product_name`} placeholder="Product name or special product description" />
                  </Field>
                  <Field label="Qty">
                    <input className={inputClass} name={`items.${row}.requested_quantity`} min="1" type="number" />
                  </Field>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="grid h-fit gap-6">
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck size={20} className="text-clay" />
              <h3 className="text-lg font-semibold">HQ Approval Workflow</h3>
            </div>
            <div className="grid gap-4">
              <Field label="Request status">
                <select className={inputClass} name="status">
                  {storeRequestStatuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </Field>
              <Field label="HQ notes">
                <textarea className={inputClass} name="hq_notes" rows={5} placeholder="Approval, rejection, allocation, stock ETA, or fulfillment notes" />
              </Field>
              <PrimaryButton type="submit">Submit request</PrimaryButton>
            </div>
          </Card>
        </aside>
      </form>
    </AppShell>
  );
}
