import { GuildMember, Message, TextChannel } from 'discord.js'
import { DBData } from '../../types/DBData'
import { UserData } from '../../types/UserData'
import calculateExp from '../functions/calculateExp'
import editUserInfoMsg from '../functions/editUserInfoMsg'
import { Client } from '../structures/client'
import UserNotFoundError from './error/UserNotFoundError'

export interface User {
  cts: Client
  member: GuildMember
  db: Message
  data: DBData
  userData: UserData
}

export class User {
  constructor(cts: Client, member: GuildMember) {
    this.cts = cts
    this.member = member
  }

  async _setup() {
    this.db = await (this.cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1025653282254880829')
    this.data = JSON.parse(this.db.content) as DBData
    if (!(this.member.id in this.data)) throw new UserNotFoundError(this.member)
    this.userData = this.data[this.member.id]
  }

  async add(name: '경험치' | 'R' | '공격력' | '체력', n: number) {
    if (!this.db) await this._setup()

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
    return this
  }

  async done() {
    if (!this.db) await this._setup() // 생성하고 바로 끝내기 ㄷㄷ

    await this.db.edit(JSON.stringify(this.data))
    await editUserInfoMsg(this.cts, this.data)
    return this.userData
  }
}
