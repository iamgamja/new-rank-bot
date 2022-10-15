import { GuildMember, TextChannel } from 'discord.js'
import { DBData } from '../../../types/DBData'
import { Client } from '../../structures/client'
import calculateExp from '../calculateExp'
import editUserInfoMsg from '../editUserInfoMsg'

export default async function addExp(cts: Client, member: GuildMember, n: number) {
  const db = await (cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1025653282254880829')
  const data = JSON.parse(db.content) as DBData

  if (member.id in data) {
    const userData = data[member.id]

    // 이전 누적 레벨 계산
    let 이전tear = userData.티어
    let 이전level = userData.레벨
    while (이전tear) {
      이전tear -= 1
      이전level += (이전tear + 1) * 5
    }
    const 이전누적레벨 = 이전level

    // 설정
    const oldTear = userData.티어
    const oldLevel = userData.레벨
    const oldExp = userData.경험치
    const [newTear, newLevel, newExp] = calculateExp(oldTear, oldLevel, oldExp + n)
    userData.티어 = newTear
    userData.레벨 = newLevel
    userData.경험치 = newExp

    // 나중 누적 레벨 계산
    let 나중tear = userData.티어
    let 나중level = userData.레벨
    while (나중tear) {
      나중tear -= 1
      나중level += (나중tear + 1) * 5
    }
    const 나중누적레벨 = 나중level

    const 추가된누적레벨 = 나중누적레벨 - 이전누적레벨

    // 공격력, 체력 수정
    userData.공격력 += 추가된누적레벨
    userData.체력 += 추가된누적레벨

    await db.edit(JSON.stringify(data))
    await editUserInfoMsg(cts, data)

    return userData
  }

  return null
}
