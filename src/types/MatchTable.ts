import { type Order } from './MatchTableInfo'

export interface MatchTableGetForm {
  matchId: string
  password: string
}

export interface MatchTableResponse {
  title: string
  player: string[]
  result: boolean[][]
  order: Order[]
  isAuthPassword: boolean
}

export interface MatchTableCreateForm {
  title: string
  matchId: string
  password: string
  player: string[]
  authPassword: string | null
}
