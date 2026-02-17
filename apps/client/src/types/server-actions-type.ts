export type ServerActionsReturns<T> = {
  success: boolean
  message?: string
  data?: T
}
