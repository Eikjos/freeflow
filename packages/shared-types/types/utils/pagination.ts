export type PaginationResult<TData> = {
  data: TData[]
  page: number
  pageSize: number
  totalItems: number
}

export type Pagination = {
  page: number
  pageSize: number
}

export type PaginationFilter<TData extends Record<string, any>> = {
  filter?: Partial<TData>
  asc?: keyof TData
  desc?: keyof TData
} & Pagination
