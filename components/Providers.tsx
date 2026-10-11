"use client";

import React, { ReactNode } from "react";
import { AppStateProvider } from "@/context/AppStateContext";
import BottomDisclaimerStrip from "@/components/BottomDisclaimerStrip";
import InfoModals from "@/components/InfoModals";
import DevHeatModelPanel from "@/components/DevHeatModelPanel";
import OfflineBanner from "@/components/OfflineBanner";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppStateProvider>
      <OfflineBanner />
      {children}
      <BottomDisclaimerStrip />
      <InfoModals />
      <DevHeatModelPanel />
      <ServiceWorkerRegister />
    </AppStateProvider>
  );
}
