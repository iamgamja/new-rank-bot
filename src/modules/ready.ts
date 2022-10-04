import { listener, Module } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { TextChannel } from 'discord.js'


class Ready extends Module {
  constructor(private cts: Client) {
    super()
  }

  @listener('ready')
  async ready() {
    this.logger.info(`Logged in as ${this.cts.client.user!.tag}`)
    const logchannel = this.cts.client.channels.cache.get('1025646462618587196') as TextChannel
    await logchannel.send('<@526889025894875158> online')
  }
}

export function install(cts: Client) {
  return new Ready(cts)
}
