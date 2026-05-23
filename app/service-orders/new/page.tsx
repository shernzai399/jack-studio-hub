import { Camera, CircleDollarSign, UserRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, Field, PrimaryButton, inputClass } from "@/components/ui";
import { stores } from "@/lib/mock-data";
import { serviceOrderStatuses } from "@/lib/types";

export default function NewServiceOrderPage() {
  return (
    <AppShell>
      <form className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <UserRound size={20} className="text-clay" />
              <h3 className="text-lg font-semibold">Customer Information</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Customer name">
                <input className={inputClass} name="customer_name" placeholder="Full name" />
              </Field>
              <Field label="Phone number">
                <input className={inputClass} name="phone" placeholder="+60..." />
              </Field>
              <Field label="Email">
                <input className={inputClass} name="email" type="email" placeholder="customer@email.com" />
              </Field>
              <Field label="Preferred contact">
                <select className={inputClass} name="preferred_contact">
                  <option>WhatsApp</option>
                  <option>Phone call</option>
                  <option>Email</option>
                </select>
              </Field>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-lg font-semibold">Service Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Service type">
                <select className={inputClass} name="service_type">
                  <option value="luggage_repair">Luggage repair</option>
                  <option value="leather_care">Leather care service</option>
                  <option value="handcraft">Handcraft service</option>
                  <option value="engraving_customization">Engraving and customization</option>
                </select>
              </Field>
              <Field label="Store drop-off location">
                <select className={inputClass} name="store_id">
                  {stores.map((store) => (
                    <option key={store}>{store}</option>
                  ))}
                </select>
              </Field>
              <Field label="Item brand">
                <input className={inputClass} name="item_brand" placeholder="Brand" />
              </Field>
              <Field label="Item model / code">
                <input className={inputClass} name="item_model" placeholder="Model, SKU, or serial" />
              </Field>
              <Field label="Item color">
                <input className={inputClass} name="item_color" placeholder="Color" />
              </Field>
              <Field label="Expected completion date">
                <input className={inputClass} name="expected_completion_date" type="date" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Item description">
                  <textarea className={inputClass} name="item_description" rows={3} placeholder="Describe the item received from customer" />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Issue description">
                  <textarea className={inputClass} name="issue_description" rows={4} placeholder="Damage, requested repair, special handling notes" />
                </Field>
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Camera size={20} className="text-clay" />
              <h3 className="text-lg font-semibold">Photo Upload</h3>
            </div>
            <div className="rounded-md border border-dashed border-black/20 bg-linen/45 p-6 text-center">
              <input className="mx-auto block text-sm" name="photos" type="file" accept="image/*" multiple />
              <p className="mt-3 text-sm text-moss">Upload front, back, defect close-up, and receipt photos.</p>
            </div>
          </Card>
        </div>

        <aside className="grid h-fit gap-6">
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <CircleDollarSign size={20} className="text-clay" />
              <h3 className="text-lg font-semibold">Quotation</h3>
            </div>
            <div className="grid gap-4">
              <Field label="Quotation amount">
                <input className={inputClass} name="quotation_amount" min="0" step="0.01" type="number" placeholder="0.00" />
              </Field>
              <Field label="Payment status">
                <select className={inputClass} name="payment_status">
                  <option value="unpaid">Unpaid</option>
                  <option value="deposit_paid">Deposit paid</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                  <option value="waived">Waived</option>
                </select>
              </Field>
              <Field label="Repair status">
                <select className={inputClass} name="status">
                  {serviceOrderStatuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </Field>
              <Field label="Quotation notes">
                <textarea className={inputClass} name="quotation_notes" rows={5} />
              </Field>
              <PrimaryButton type="submit">Create service order</PrimaryButton>
            </div>
          </Card>
        </aside>
      </form>
    </AppShell>
  );
}
