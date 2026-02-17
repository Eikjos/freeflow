'use client'

import { createContext, useContext, useState } from 'react'
import { EnterpriseInfo } from '../../types/enterprise-info-type'

interface EnterpriseContextType {
  enterprise: EnterpriseInfo | undefined
  setEnterprise: (value: EnterpriseInfo) => void
}

const EnterpriseContext = createContext<EnterpriseContextType>({
  enterprise: undefined,
  setEnterprise: () => undefined,
})

export const useEnterprise = () => useContext(EnterpriseContext)

interface ProviderProps {
  initialEnterprise: EnterpriseInfo | undefined
  children: React.ReactNode
}

export function EnterpriseProvider({
  initialEnterprise,
  children,
}: ProviderProps) {
  const [enterprise, setEnterprise] = useState<EnterpriseInfo | undefined>(
    initialEnterprise,
  )

  return (
    <EnterpriseContext.Provider value={{ enterprise, setEnterprise }}>
      {children}
    </EnterpriseContext.Provider>
  )
}
