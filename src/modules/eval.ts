import { Module, applicationCommand } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, TextChannel } from 'discord.js'
import { DBData } from '../../types/DBData'

class Eval extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: 'eval',
      description: 'eval',
    },
  })
  async eval_(i: CommandInteraction) {
    // Code
  }
}

export function install(cts: Client) {
  return new Eval(cts)
}
