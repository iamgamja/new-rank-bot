import { Snowflake } from 'discord.js'
import { UserData } from './UserData'

export interface DBData {
  [key: Snowflake]: UserData
}
