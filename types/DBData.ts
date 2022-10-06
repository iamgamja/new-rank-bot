import { Snowflake } from 'discord.js'

export interface DBData {
  [key: Snowflake]: {
    스탯: {
      티어: number // 0-index
      레벨: number // 1-index
      경험치: number // 0-index
    }
    공격력: number
    체력: number
    소지품: {
      재화: {
        R: number
      }
    }
  }
}
