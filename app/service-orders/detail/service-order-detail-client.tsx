"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, CircleDollarSign, ImageIcon, UserRound } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { fetchServiceOrderDetail } from "@/lib/supabase/data";
import type { ServiceOrderDetail } from "@/lib/types";

export function ServiceOrderDetailClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<ServiceOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setError("Service order id is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");
      try {
        setOrder(await fetchServiceOrderDetail(orderId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load service order.");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/service-orders" className="inline-flex min-h-10 items-center gap-2 rounded-md border border-black/10 bg-white px-3 text-sm font-semibold text-ink hover:bg-linen">
          <ArrowLeft size={16} />
          Back to orders
        </Link>
        {order && <Badge>{order.status}</Badge>}
      </div>

      {isLoading && <p className="text-sm text-moss">Loading service order...</p>}
      {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

      {order && (
        <>
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-moss">Service order</p>
                <h3 className="mt-1 text-2xl font-semibold text-ink">{order.orderNo}</h3>
                <p className="mt-2 text-sm text-moss">{order.serviceType} from {order.storeName}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-moss">Payment</p>
                <p className="mt-1 font-semibold text-ink">{order.paymentStatus}</p>
                <p className="mt-2 text-sm text-moss">Updated {order.updatedAt}</p>
              </div>
            </div>
          </Card>

          <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="grid gap-6">
              <Card>
                <div className="mb-4 flex items-center gap-2">
                  <UserRound size={20} className="text-clay" />
                  <h3 className="text-lg font-semibold">Customer Information</h3>
                </div>
                <dl className="grid gap-4 md:grid-cols-2">
                  <Detail label="Customer name" value={order.customerName} />
                  <Detail label="Phone" value={order.customerPhone} />
                  <Detail label="Email" value={order.customerEmail || "-"} />
                  <Detail label="Preferred contact" value={order.preferredContact || "-"} />
                </dl>
              </Card>

              <Card>
                <h3 className="mb-4 text-lg font-semibold">Item and Repair Details</h3>
                <dl className="grid gap-4 md:grid-cols-2">
                  <Detail label="Brand" value={order.itemBrand || "-"} />
                  <Detail label="Model / code" value={order.itemModel || "-"} />
                  <Detail label="Color" value={order.itemColor || "-"} />
                  <Detail label="Expected completion" value={order.expectedCompletionDate || "-"} />
                  <div className="md:col-span-2"><Detail label="Item description" value={order.itemDescription} /></div>
                  <div className="md:col-span-2"><Detail label="Issue description" value={order.issueDescription} /></div>
                  {order.requestedWork && <div className="md:col-span-2"><Detail label="Requested work" value={order.requestedWork} /></div>}
                </dl>
              </Card>

              <Card>
                <div className="mb-4 flex items-center gap-2">
                  <ImageIcon size={20} className="text-clay" />
                  <h3 className="text-lg font-semibold">Photos</h3>
                </div>
                {order.photos.length === 0 ? (
                  <p className="text-sm text-moss">No photos uploaded yet.</p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {order.photos.map((photo) => (
                      <div key={photo.id} className="rounded-md border border-black/10 p-3">
                        <p className="font-medium text-ink">{photo.caption || "Service photo"}</p>
                        <p className="mt-1 break-all text-sm text-moss">{photo.storagePath}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            <aside className="grid h-fit gap-6">
              <Card>
                <div className="mb-4 flex items-center gap-2">
                  <CircleDollarSign size={20} className="text-clay" />
                  <h3 className="text-lg font-semibold">Quotation</h3>
                </div>
                <dl className="grid gap-4">
                  <Detail label="Amount" value={order.quotationAmount ? `RM ${order.quotationAmount.toFixed(2)}` : "-"} />
                  <Detail label="Notes" value={order.quotationNotes || "-"} />
                </dl>
              </Card>

              <Card>
                <div className="mb-4 flex items-center gap-2">
                  <CalendarDays size={20} className="text-clay" />
                  <h3 className="text-lg font-semibold">Timeline</h3>
                </div>
                <dl className="grid gap-4">
                  <Detail label="Created" value={order.createdAt} />
                  <Detail label="Last updated" value={order.updatedAt} />
                </dl>
              </Card>
            </aside>
          </section>
        </>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-moss">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm text-ink">{value}</dd>
    </div>
  );
}
