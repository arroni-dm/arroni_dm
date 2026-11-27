"use client";

import { createContext, useContext } from "react";

// Dialogs portal into the admin root (not <body>) so they inherit its fonts and colours.
export const PortalContainerContext = createContext<HTMLElement | null>(null);

export const usePortalContainer = () => useContext(PortalContainerContext) ?? undefined;
