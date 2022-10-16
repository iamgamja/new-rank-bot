import { Module, applicationCommand } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember, TextChannel } from 'discord.js'
import { User } from '../class/User'
import UserNotFoundError from '../class/error/UserNotFoundError'

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

    try {
      const member = i.member as GuildMember
      const user = new User(this.cts, member)
      await user._setup()

      await i.deferReply()

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
        await i.editReply({
          content: '```diff\n- 쿨타임을 기다려주세요.\n```\n' + `실행 가능한 시간: <t:${Math.floor((출첵coolTimeData[member.id] - 9 * 60 * 60 * 1000) / 1000)}:R>`,
        })
        return
      }

      const d = new Date()
      d.setHours(d.getHours() + 9)

      d.setMilliseconds(0)
      d.setSeconds(0)
      d.setMinutes(0)
      d.setHours(0)
      d.setDate(d.getDate() + 1)

      출첵coolTimeData[member.id] = d.getTime()
      await 출첵coolTimeDB.edit(JSON.stringify(출첵coolTimeData))

      await user.add('경험치', 50)
      await user.add('R', 50)

      await i.editReply({
        content: '```diff\n출첵했습니다.\n+ EXP 50\n+ R 50\n```',
      })
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        await i.editReply({ content: '```diff\n- 등록되지 않은 유저입니다.\n```' })
      }
    }
  }
}

export function install(cts: Client) {
  return new 출첵(cts)
}
