import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { ServiceOrderDetailClient } from "@/app/service-orders/detail/service-order-detail-client";

export default function ServiceOrderDetailPage() {
  return (
    <AppShell>
      <Suspense fallback={<p className="text-sm text-moss">Loading service order...</p>}>
        <ServiceOrderDetailClient />
      </Suspense>
    </AppShell>
  );
}
