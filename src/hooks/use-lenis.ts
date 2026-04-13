import { LenisContext } from "@/contexts/lenis-context";
import { useContext } from "react";

export function useLenis() {
  return useContext(LenisContext);
}
