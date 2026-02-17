'use client'

import { createContext, useContext, useState } from 'react'
import { CustomerInfo } from '../../types/customer-info-type'

interface CustomerContextType {
  customer: CustomerInfo | undefined
  setCustomer: (value: CustomerInfo) => void
}

const CustomerContext = createContext<CustomerContextType>({
  customer: undefined,
  setCustomer: () => undefined,
})

export const useCustomer = () => useContext(CustomerContext)

interface ProviderProps {
  initialCustomer: CustomerInfo | undefined
  children: React.ReactNode
}

export function CustomerProvider({ initialCustomer, children }: ProviderProps) {
  const [customer, setCustomer] = useState<CustomerInfo | undefined>(
    initialCustomer,
  )

  return (
    <CustomerContext.Provider value={{ customer, setCustomer }}>
      {children}
    </CustomerContext.Provider>
  )
}
