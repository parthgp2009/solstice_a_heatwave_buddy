"use client";

import React, { ReactNode } from "react";
import { AppStateProvider } from "@/context/AppStateContext";
import BottomDisclaimerStrip from "@/components/BottomDisclaimerStrip";
import InfoModals from "@/components/InfoModals";
import DevHeatModelPanel from "@/components/DevHeatModelPanel";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppStateProvider>
      {children}
      <BottomDisclaimerStrip />
      <InfoModals />
      <DevHeatModelPanel />
    </AppStateProvider>
  );
}
