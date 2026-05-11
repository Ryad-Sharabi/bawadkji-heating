"use client";

import { Suspense } from "react";
import { FloatingAiChat } from "./FloatingAiChat";

export function FloatingContactButtonRoot() {
  return (
    <Suspense fallback={null}>
      <FloatingAiChat />
    </Suspense>
  );
}
