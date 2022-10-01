import { listener, Module, applicationCommand, ownerOnly, command, rest } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember, Message, Snowflake, TextChannel } from 'discord.js'
import { DBData } from '../../types/DBData'

class Eval extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: '내정보',
      description: '내 정보를 확인합니다!',
    },
  })
  async 내정보(i: CommandInteraction) {
    const db = await (this.cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1025653282254880829')
    const data = JSON.parse(db.content) as DBData
    const member = i.member as GuildMember
    if (member.user.id in data) {
      const userData = data[member.user.id]
      await i.reply({
        content:
          `${member.displayName}님의 정보:\n` +
          '```\n' +
          `${/** @todo */ userData.스탯.티어} Lv. ${userData.스탯.레벨} / EXP ${userData.스탯.경험치}\n` +
          `소지품:\n` +
          `- R ${userData.소지품.재화.R}\n` +
          '```',
        ephemeral: false,
      })
    } else {
      await i.reply({ content: '```diff\n- 등록 후 이용해주세요.\n```', ephemeral: true })
    }
    await i.reply({ content: `hi` })
  }
}

export function install(cts: Client) {
  return new Eval(cts)
}
