import { Module, applicationCommand, option } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember, TextChannel } from 'discord.js'
import { DBData } from '../../types/DBData'
import Data_Tears from '../data/tears'
import calculateExp from '../functions/calculateExp'
import addExp from '../functions/add/addExp'
import addThing from '../functions/add/addThing'

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

    const member = i.member as GuildMember

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

    const result = await addExp(this.cts, member, 50)
    const result2 = await addThing(this.cts, member, 'R', 50)

    if (result && result2) {
      await i.editReply({
        content: '```diff\n출첵했습니다.\n+ EXP 50\n+ R 50\n```',
      })
    } else {
      await i.editReply({ content: '```diff\n- 등록되지 않은 유저입니다.\n```' })
    }
  }
}

export function install(cts: Client) {
  return new 출첵(cts)
}
