import { Module, applicationCommand, option } from '@pikokr/command.ts'
import { Client } from '../../structures/client'
import { CommandInteraction, GuildMember, TextChannel } from 'discord.js'
import { DBData } from '../../../types/DBData'
import calculateExp from '../../functions/calculateExp'
import Data_Tears from '../../data/tears'

class Eval extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: 'eval',
      description: 'eval',
      options: [
        {
          name: '식',
          description: '식',
          required: true,
          type: 'STRING',
        },
      ],
    },
  })
  async eval_(i: CommandInteraction, @option('식') 식: string) {
    if ((i.member as GuildMember).id !== '526889025894875158') return

    const db = await (this.cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1025653282254880829')
    const data = JSON.parse(db.content)
    const userInfoMsg = await (this.cts.client.channels.cache.get('1025347124294070282') as TextChannel).messages.fetch('1025975950439088168')

    async function editUserInfoMsg() {
      let r: string[] = []

      for (let userID in data) {
        const userData = data[userID]

        r.push(
          `<@${userID}>님 (ID: ${userData.id.toString().padStart(6, '0')}) 의 정보:\n` +
            '```\n' +
            `${Data_Tears[userData.티어]} Lv. ${userData.레벨} / EXP ${userData.경험치}\n` +
            `공격력: ${userData.공격력} / HP: ${userData.체력}\n` +
            `소지품:\n` +
            `  R ${userData.R}\n` +
            `장착:\n` +
            `  무기: ${userData.무기}\n` +
            `  방어구: ${userData.방어구}\n` +
            '```'
        )
      }

      await userInfoMsg.edit(r.join('\n\n'))
    }

    try {
      const result = eval(식)
      this.logger.info(result)
      await i.reply({ content: result.toString(), ephemeral: true })
    } catch (e) {
      let errormsg
      if (e instanceof Error) errormsg = ['```js', '<name>', e.name, '<message>', e.message, '<stack>', e.stack, '```'].join('\n')
      else errormsg = 'Unknown Error: ' + String(e)
      await i.reply({ content: '에러남저런\n' + errormsg, ephemeral: true })
    }
  }
}

export function install(cts: Client) {
  return new Eval(cts)
}
