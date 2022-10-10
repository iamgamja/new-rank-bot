import { Module, applicationCommand } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { ApplicationCommandType, CommandInteraction, GuildMember, TextChannel } from 'discord.js'
import { DBData } from '../../types/DBData'
import Data_Dungeon from '../data/Dungeon'
import calculateExp from '../functions/calculateExp'
import editUserInfoMsg from '../functions/editUserInfoMsg'
import Data_CoolTime from '../data/cooltime'

function makeCommandOption(name: string) {
  return {
    command: {
      type: 'CHAT_INPUT' as ApplicationCommandType,
      name: name,
      description: `${name}을 처치합니다.`,
    },
  }
}

async function makeCommandFunc(cts: Client, name: string) {
  return async function resultFunc(i: CommandInteraction) {
    const db = await (cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1025653282254880829')
    const data = JSON.parse(db.content) as DBData
    const member = i.member as GuildMember
    const target = Data_Dungeon[name]
    if (member.user.id in data) {
      if (i.channelId !== target.channelID) {
        await i.reply({ content: '```diff\n- 잘못된 채널입니다.\n```\n' + `실행 가능한 채널: <#${target.channelID}>`, ephemeral: true })
        return
      }
      const coolTimeDB = await (cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1028912965786796144')
      const coolTimeData = JSON.parse(coolTimeDB.content)
      let ispossible_cooltime: boolean
      if (member.user.id in coolTimeData[target.channelID]) {
        if (coolTimeData[target.channelID][member.user.id] <= new Date().getTime()) {
          ispossible_cooltime = true // 시간이 지났으므로 가능
        } else {
          ispossible_cooltime = false
        }
      } else {
        ispossible_cooltime = true // 아직 실행한 적이 없으면 가능
      }
      if (!ispossible_cooltime) {
        await i.reply({
          content: '```diff\n- 쿨타임을 기다려주세요.\n```\n' + `실행 가능한 시간: <t:${Math.floor(coolTimeData[target.channelID][member.user.id] / 1000)}:R>`,
          ephemeral: true,
        })
        return
      }

      coolTimeData[target.channelID][member.user.id] = new Date().getTime() + Data_CoolTime[target.channelID] * 1000
      await coolTimeDB.edit(JSON.stringify(coolTimeData))

      const userData = data[member.user.id]

      let ispossible_strong: boolean
      if (target.공격력 === 0) {
        ispossible_strong = true
      } else {
        ispossible_strong = Math.ceil(target.체력 / userData.공격력) > Math.ceil(userData.체력 / target.공격력) ? false : true
      }

      if (!ispossible_strong) {
        await i.reply({ content: '```diff\n- 처치하지 못했습니다...\n```', ephemeral: true })
        return
      }
      // 처치
      userData.R += target.획득R

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
      // this.logger.info(oldTear, oldLevel, oldExp + target[2])
      const [newTear, newLevel, newExp] = calculateExp(oldTear, oldLevel, oldExp + target.획득경험치)
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

      await i.reply({ content: '```diff\n처치했습니다.\n' + `+ EXP ${target.획득경험치}\n+ R ${target.획득R}` + '```' })

      /** @todo 획득 아이템 자동화 */
    } else {
      await i.reply({ content: '```diff\n- 등록되지 않은 유저입니다.\n```', ephemeral: true })
    }
  }
}

class Dungeon extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand(makeCommandOption('슬라임'))
  async ['슬라임'](i: CommandInteraction) {
    return await (
      await makeCommandFunc(this.cts, '슬라임')
    )(i)
  }

  @applicationCommand(makeCommandOption('풀슬라임'))
  async ['풀슬라임'](i: CommandInteraction) {
    return await (
      await makeCommandFunc(this.cts, '풀슬라임')
    )(i)
  }

  @applicationCommand(makeCommandOption('잎슬라임'))
  async ['잎슬라임'](i: CommandInteraction) {
    return await (
      await makeCommandFunc(this.cts, '잎슬라임')
    )(i)
  }

  @applicationCommand(makeCommandOption('나무슬라임'))
  async ['나무슬라임'](i: CommandInteraction) {
    return await (
      await makeCommandFunc(this.cts, '나무슬라임')
    )(i)
  }

  @applicationCommand(makeCommandOption('숲슬라임'))
  async ['숲슬라임'](i: CommandInteraction) {
    return await (
      await makeCommandFunc(this.cts, '숲슬라임')
    )(i)
  }

  @applicationCommand(makeCommandOption('작은강가슬라임'))
  async ['작은강가슬라임'](i: CommandInteraction) {
    return await (
      await makeCommandFunc(this.cts, '작은강가슬라임')
    )(i)
  }

  @applicationCommand(makeCommandOption('작은강가정령'))
  async ['작은강가정령'](i: CommandInteraction) {
    return await (
      await makeCommandFunc(this.cts, '작은강가정령')
    )(i)
  }
}

export function install(cts: Client) {
  return new Dungeon(cts)
}
