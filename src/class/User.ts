import { GuildMember, Message, Snowflake, TextChannel } from 'discord.js'
import { DBData } from '../../types/DBData'
import { 출첵CoolTimeDBData } from '../../types/출첵CoolTimeDBData'
import { CoolTimeDBData } from '../../types/CoolTimeDBData'
import { UserData } from '../../types/UserData'
import calculateExp from '../functions/calculateExp'
import editUserInfoMsg from '../functions/editUserInfoMsg'
import { Client } from '../structures/client'
import UserNotFoundError from './error/UserNotFoundError'
import Data_CoolTime from '../data/cooltime'

export interface User {
  cts: Client
  member: GuildMember
  db: Message
  data: DBData
  userData: UserData
  출첵coolTimeDB: Message
  출첵coolTimeData: 출첵CoolTimeDBData
  coolTimeDB: Message
  coolTimeData: CoolTimeDBData
}

export class User {
  constructor(cts: Client, member: GuildMember) {
    this.cts = cts
    this.member = member
  }

  async _setup() {
    this.db = await (this.cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1025653282254880829')
    this.data = JSON.parse(this.db.content)
    if (!(this.member.id in this.data)) throw new UserNotFoundError(this.member)
    this.userData = this.data[this.member.id]

    this.출첵coolTimeDB = await (this.cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1030671119797207040')
    this.출첵coolTimeData = JSON.parse(this.출첵coolTimeDB.content)

    this.coolTimeDB = await (this.cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1028912965786796144')
    this.coolTimeData = JSON.parse(this.coolTimeDB.content)
  }

  async add(name: '경험치' | 'R' | '공격력' | '체력', n: number) {
    if (name === '경험치') {
      // 이전 누적 레벨 계산
      let 이전tear = this.userData.티어
      let 이전level = this.userData.레벨
      while (이전tear) {
        이전tear -= 1
        이전level += (이전tear + 1) * 5
      }
      const 이전누적레벨 = 이전level

      // 설정
      const oldTear = this.userData.티어
      const oldLevel = this.userData.레벨
      const oldExp = this.userData.경험치
      const [newTear, newLevel, newExp] = calculateExp(oldTear, oldLevel, oldExp + n)
      this.userData.티어 = newTear
      this.userData.레벨 = newLevel
      this.userData.경험치 = newExp

      // 나중 누적 레벨 계산
      let 나중tear = this.userData.티어
      let 나중level = this.userData.레벨
      while (나중tear) {
        나중tear -= 1
        나중level += (나중tear + 1) * 5
      }
      const 나중누적레벨 = 나중level

      const 추가된누적레벨 = 나중누적레벨 - 이전누적레벨

      // 공격력, 체력 수정
      this.userData.공격력 += 추가된누적레벨
      this.userData.체력 += 추가된누적레벨
    } else {
      this.userData[name] += n
    }
  }

  mount(type: '무기' | '방어구', name: string) {
    this.userData[type] = name
  }

  async done() {
    await this.db.edit(JSON.stringify(this.data))
    await editUserInfoMsg(this.cts, this.data)
    return this.userData
  }

  async can출첵() {
    let result: [true] | [false, number]
    if (this.member.id in this.출첵coolTimeData) {
      const d = new Date()
      d.setHours(d.getHours() + 9) // 시차 적용
      if (this.출첵coolTimeData[this.member.id] <= d.getTime()) {
        result = [true] // 시간이 지났으므로 가능
      } else {
        result = [false, this.출첵coolTimeData[this.member.id]]
      }
    } else {
      result = [true] // 아직 실행한 적이 없으면 가능
    }

    if (result[0]) {
      // db 수정
      const d = new Date()
      d.setHours(d.getHours() + 9)

      d.setMilliseconds(0)
      d.setSeconds(0)
      d.setMinutes(0)
      d.setHours(0)
      d.setDate(d.getDate() + 1)

      this.출첵coolTimeData[this.member.id] = d.getTime()
      await this.출첵coolTimeDB.edit(JSON.stringify(this.출첵coolTimeData))
    }
    return result
  }

  async can공격(channelID: Snowflake) {
    let result: [true] | [false, number]
    if (this.member.id in this.coolTimeData[channelID]) {
      if (this.coolTimeData[channelID][this.member.id] <= new Date().getTime()) {
        result = [true] // 시간이 지났으므로 가능
      } else {
        result = [false, this.coolTimeData[channelID][this.member.id]]
      }
    } else {
      result = [true] // 아직 실행한 적이 없으면 가능
    }

    // db 수정
    this.coolTimeData[channelID][this.member.user.id] = new Date().getTime() + Data_CoolTime[channelID] * 1000
    await this.coolTimeDB.edit(JSON.stringify(this.coolTimeData))

    return result
  }

  get 누적레벨() {
    let tear = this.userData.티어
    let level = this.userData.레벨
    while (tear) {
      tear -= 1
      level += (tear + 1) * 5
    }

    return level
  }
}
