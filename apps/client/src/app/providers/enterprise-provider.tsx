"use client";

import { createContext, useContext } from "react";
import { EnterpriseInfo } from "../../types/enterprise-info-type";

interface EnterpriseContextType {
  enterprise: EnterpriseInfo | undefined;
}

const EnterpriseContext = createContext<EnterpriseContextType>({
  enterprise: undefined,
});

export const useEnterprise = () => useContext(EnterpriseContext);

interface ProviderProps {
  enterprise: EnterpriseInfo | undefined;
  children: React.ReactNode;
}

export function EnterpriseProvider({ enterprise, children }: ProviderProps) {
  return (
    <EnterpriseContext.Provider value={{ enterprise }}>
      {children}
    </EnterpriseContext.Provider>
  );
}
