import type Lenis from "lenis";
import { createContext } from "react";

export const LenisContext = createContext<Lenis | null>(null);
