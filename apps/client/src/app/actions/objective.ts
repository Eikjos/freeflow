import { CreateObjectiveData } from '@repo/shared-types'
import { client } from '../../lib/client'

export const createObjective = (values: CreateObjectiveData) =>
  client(`objectives`, { body: JSON.stringify(values), method: 'POST' }).then(
    (res) => {
      if (res.error) {
        throw Error(res.error)
      }
    },
  )

export const updateObjective = (id: number, values: CreateObjectiveData) =>
  client(`objectives/${id}`, {
    body: JSON.stringify(values),
    method: 'PUT',
  }).then((res) => {
    if (res.error) {
      throw new Error(res.error)
    }
  })

export const deleteObjective = (id: number) =>
  client(`objectives/${id}`, {
    method: 'DELETE',
  }).then((res) => {
    if (res.error) {
      throw new Error(res.error)
    }
  })
