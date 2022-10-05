import { Module, applicationCommand, option } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember, TextChannel } from 'discord.js'
import { DBData } from '../../types/DBData'
import calculateExp from '../functions/calculateExp'

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
