export type HttpResponse<T> = {
  data?: T
  ok: boolean
  error?: string
}
