import type { ReactNode } from "react";
import { ContentEngineFooter, ContentEngineHeader } from "@/features/content-engine/ui/content-engine-shell";

export default function ContentEngineLayout({ children }: { children: ReactNode }) {
  return <><ContentEngineHeader/>{children}<ContentEngineFooter/></>;
}
