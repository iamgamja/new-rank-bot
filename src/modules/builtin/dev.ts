import { BuiltInModule, ownerOnly, applicationCommand } from '@pikokr/command.ts'
import { Client } from '../../structures/client'
import { CommandInteraction } from 'discord.js'

class Dev extends BuiltInModule {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: 'reload',
      description: '리로드',
    },
  })
  @ownerOnly
  async reload(i: CommandInteraction) {
    await i.deferReply({
      ephemeral: true,
    })
    const data = await this.cts.registry.reloadAll()
    await this.cts.registry.syncCommands()
    await i.editReply({
      content: '```\n' + data.map((x) => (x.success ? `✅ ${x.path}` : `❌ ${x.path}\n${x.error}`)).join('\n') + '```',
    })
  }
}

export function install(cts: Client) {
  return new Dev(cts)
}
