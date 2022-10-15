import { Module, applicationCommand, option } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember, TextChannel } from 'discord.js'
import { DBData } from '../../types/DBData'
import Data_Tears from '../data/tears'
import calculateExp from '../functions/calculateExp'

class 출첵 extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: 'ㅊㅊ',
      description: '출첵합니다.',
    },
  })
  async ㅊㅊ(i: CommandInteraction) {
    if (i.channelId !== '1001389058473345154') {
      await i.reply({ content: '```diff\n- 잘못된 채널입니다.\n```\n실행 가능한 채널: <#1001389058473345154>', ephemeral: true })
      return
    }

    const db = await (this.cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1025653282254880829')
    const data = JSON.parse(db.content) as DBData
    const member = i.member as GuildMember
    if (member.user.id in data) {
      const 출첵coolTimeDB = await (this.cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1030671119797207040')
      const 출첵coolTimeData = JSON.parse(출첵coolTimeDB.content)

      let ispossible_cooltime: boolean
      if (member.user.id in 출첵coolTimeData) {
        const d = new Date()
        d.setHours(d.getHours() + 9)
        if (출첵coolTimeData[member.id] <= d.getTime()) {
          ispossible_cooltime = true // 시간이 지났으므로 가능
        } else {
          ispossible_cooltime = false
        }
      } else {
        ispossible_cooltime = true // 아직 실행한 적이 없으면 가능
      }

      if (!ispossible_cooltime) {
        await i.reply({
          content: '```diff\n- 쿨타임을 기다려주세요.\n```\n' + `실행 가능한 시간: <t:${Math.floor((출첵coolTimeData[member.id] - 9 * 60 * 60 * 1000) / 1000)}:R>`,
          ephemeral: true,
        })
        return
      }

      await i.deferReply()

      const d = new Date()
      d.setHours(d.getHours() + 9)

      d.setMilliseconds(0)
      d.setSeconds(0)
      d.setMinutes(0)
      d.setHours(0)
      d.setDate(d.getDate() + 1)

      출첵coolTimeData[member.id] = d.getTime()
      await 출첵coolTimeDB.edit(JSON.stringify(출첵coolTimeData))

      const userData = data[member.user.id]

      // 경험치 추가

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
      this.logger.info(oldTear, oldLevel, oldExp + 50)
      const [newTear, newLevel, newExp] = calculateExp(oldTear, oldLevel, oldExp + 50)
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

      // R 추가
      userData.R += 50

      await db.edit(JSON.stringify(data))

      await i.editReply({
        content: '```diff\n출첵했습니다.\n+ EXP 50\n+ R 50\n```',
      })
    } else {
      await i.reply({ content: '```diff\n- 등록되지 않은 유저입니다.\n```', ephemeral: true })
    }
  }
}

export function install(cts: Client) {
  return new 출첵(cts)
}
