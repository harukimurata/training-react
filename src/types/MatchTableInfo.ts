export type Order = {
  card: string
  result: number
}

export interface MatchTableInfoUpdateForm {
  matchId: string
  authPassword: string | null
  result: boolean[][]
  order: Order[]
}
