import { Module, applicationCommand } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember } from 'discord.js'
import getUser from '../functions/getUser'

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
    await i.deferReply()

    if (i.channelId !== '1001389058473345154') {
      await i.editReply({ content: '```diff\n- 잘못된 채널입니다.\n```\n실행 가능한 채널: <#1001389058473345154>' })
      return
    }

    const member = i.member as GuildMember
    const user = await getUser(this.cts, member)
    if (!user) {
      await i.editReply({ content: '```diff\n- 등록되지 않은 유저입니다.\n```' })
      return
    }

    const { can출첵, canTime } = await user.can출첵()
    if (!can출첵) {
      await i.editReply({
        content: '```diff\n- 쿨타임을 기다려주세요.\n```\n' + `실행 가능한 시간: <t:${Math.floor((canTime - 9 * 60 * 60 * 1000) / 1000)}:R>`,
      })
      return
    }

    await user.add('경험치', 2 ** (user.누적레벨 - 1) * 10)
    await user.add('R', 2 ** (user.누적레벨 - 1) * 10)
    await user.done()

    await i.editReply({
      content: '```diff\n출첵했습니다.\n+ EXP 50\n+ R 50\n```',
    })
  }
}

export function install(cts: Client) {
  return new 출첵(cts)
}
