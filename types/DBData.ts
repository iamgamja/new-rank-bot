import { Snowflake } from 'discord.js'

export interface DBData {
  [key: Snowflake]: {
    티어: number // 0-index
    레벨: number // 1-index
    경험치: number // 0-index
    공격력: number
    체력: number
    R: number
  }
}
