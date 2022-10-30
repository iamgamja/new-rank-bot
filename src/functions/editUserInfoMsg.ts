import { TextChannel } from 'discord.js'
import { DBData } from '../types/DBData'
import Data_Tears from '../data/tears'
import { Client } from '../structures/client'

export default async function editUserInfoMsg(cts: Client, data: DBData) {
  const userInfoMsg = await (cts.client.channels.cache.get('1025347124294070282') as TextChannel).messages.fetch('1025975950439088168')
  const r: string[] = []

  for (const userID in data) {
    const userData = data[userID]

    r.push(
      `<@${userID}>님 (ID: ${userData.id.toString().padStart(6, '0')}) 의 정보:\n` +
        '```\n' +
        `${Data_Tears[userData.티어]} Lv. ${userData.레벨} / EXP ${userData.경험치}\n` +
        `공격력: ${userData.공격력} / HP: ${userData.체력}\n` +
        `소지품:\n` +
        `  R ${userData.R}\n` +
        `장착:\n` +
        `  무기: ${userData.무기}\n` +
        `  방어구: ${userData.방어구}\n` +
        '```'
    )
  }

  await userInfoMsg.edit(r.join('\n\n'))
}
