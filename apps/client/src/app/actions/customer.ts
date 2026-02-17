'use server'

import { CustomerCreateModel, CustomerModel } from '@repo/shared-types'
import { client } from '../../lib/client'

export const CreateCustomer = (model: CustomerCreateModel) =>
  client<CustomerModel>(`customers`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(model),
  })
    .then((data) => {
      return data
    })
    .catch(() => {
      return null
    })

export const UpdateCustomer = (id: number, model: CustomerCreateModel) =>
  client<CustomerModel>(`customers/${id}`, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify(model),
  })
    .then((data) => {
      return data
    })
    .catch(() => {
      return null
    })

export const deleteCustomer = (id: number) =>
  client(`customers/${id}`, { method: 'DELETE' })

export const inviteCustomer = async (id: number) =>
  client(`customers/${id}/invite`, { method: 'POST' })
