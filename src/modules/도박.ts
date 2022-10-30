import { Module, applicationCommand, option } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember } from 'discord.js'
import getUser from '../functions/getUser'

class 도박 extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: '도박',
      description: '도박을 진행합니다.',
      options: [
        {
          name: '배팅',
          description: '배팅할 R입니다.',
          required: true,
          type: 'NUMBER',
        },
      ],
    },
  })
  async 도박(i: CommandInteraction, @option('배팅') 배팅: number) {
    await i.deferReply()

    if (i.channelId !== '1025359305689550869') {
      await i.editReply({ content: '```diff\n- 잘못된 채널입니다.\n```\n실행 가능한 채널: <#1025359305689550869>' })
      return
    }

    const member = i.member as GuildMember
    const user = await getUser(this.cts, member)
    if (!user) {
      await i.editReply({ content: '```diff\n- 등록되지 않은 유저입니다.\n```' })
      return
    }

    const { can도박, canTime } = await user.can도박()
    if (!can도박) {
      await i.editReply({
        content: '```diff\n- 쿨타임을 기다려주세요.\n```\n' + `실행 가능한 시간: <t:${Math.floor(canTime / 1000)}:R>`,
      })
      return
    }

    if (배팅 % 10) {
      await i.editReply({ content: '```diff\n- 베팅은 10 R 단위로 가능합니다.\n```' })
      return
    }

    if (배팅 >= user.userData.R) {
      await i.editReply({ content: '```diff\n- R이 부족합니다.\n```' })
      return
    }

    if (배팅 < 0) {
      await i.editReply({ content: '```diff\n- 배팅 금액은 음수일 수 없습니다.\n```' })
      return
    }

    await user.add('R', -배팅)

    const 배율 = (() => {
      let x = Math.random() * 100
      if (x < 5) return 2 // 5%
      x -= 5
      if (x < 10) return 1.5 // 10%
      x -= 10
      if (x < 50) return 1 // 50%
      x -= 50
      if (x < 25) return 0.5 // 25%
      return 0 // 10%
    })()

    await user.add('R', 배율 * 배팅)
    await user.done()

    await i.editReply({
      content: '```diff\n' + `x${배율}\n` + '```',
    })
  }
}

export function install(cts: Client) {
  return new 도박(cts)
}
