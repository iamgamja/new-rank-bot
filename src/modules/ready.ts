import { listener, Module } from '@pikokr/command.ts'
import { Client } from '../structures/client'

class Ready extends Module {
  constructor(private cts: Client) {
    super()
  }

  @listener('ready')
  ready() {
    this.logger.info(`Logged in as ${this.cts.client.user!.tag}`)
  }
}

export function install(cts: Client) {
  return new Ready(cts)
}
