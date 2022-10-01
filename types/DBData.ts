import { Snowflake } from 'discord.js'

export interface DBData {
  [key: Snowflake]: {
    스탯: {
      티어: number
      레벨: number
      경험치: number
    }
    소지품: {
      재화: {
        R: number
      }
    }
  }
}
