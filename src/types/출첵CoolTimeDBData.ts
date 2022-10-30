import { Snowflake } from 'discord.js'

export interface 출첵CoolTimeDBData {
  [userID: Snowflake]: number // timestamp, 이 timestamp가 지나야 다시 커맨드 사용 가능
}
