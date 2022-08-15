import { api, params } from '@serverless/cloud'
import { InteractionResponseType, InteractionType, verifyKeyMiddleware } from 'discord-interactions'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

import { getAirport } from './functions/getAirport'

const commonOptions = [
  {
    name: 'airport',
    description: 'ICAO of an airport',
    type: 3,
    required: true
  },
  {
    name: 'service',
    description: 'GND, TWR etc.',
    type: 3,
    required: false
  }
]
const commands = [
  {
    name: 'ping',
    description: 'Ping for testing'
  },
  {
    name: 'status',
    description: 'Get current status of an airport',
    options: commonOptions
  },
  {
    name: 'watch',
    description: 'Begin watching an airport. Recieve a notification when it becomes online',
    options: commonOptions
  },
  {
    name: 'unwatch',
    description: 'Stop watching an airport. Stop recieving notifications for that airport.',
    options: commonOptions
  },
  {
    name: 'unsubscribe',
    description: 'Remove all airports from watchlist. Your discord tag will be deleted too.',
    options: commonOptions
  }
]
const rest = new REST({ version: '9' }).setToken(params.DISCORD_BOT_TOKEN)

api.get('/', async (req, res) => {
  try {
    await rest.put(Routes.applicationGuildCommands(params.DISCORD_CLIENT_ID, '1008489070403522610'), {
      body: commands
    })
    return res.sendStatus(200)
  } catch (e) {
    console.error(e)
    return res.sendStatus(500)
  }
})

const sendResponse = (res) => (content) => {
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content
    }
  })
}

api.post('/discord', api.rawBody, verifyKeyMiddleware(params.DISCORD_PUBLIC_KEY), async (req, res) => {
  const message = req.body
  const commandName = message.data.name ?? undefined
  if (!commandName) {
    return res.sendStatus(500)
  }
  const channelId = message.channel_id
  const guildId = message.guild_id
  const username = message.member.user.username

  const reply = sendResponse(res)

  if (message.type === InteractionType.APPLICATION_COMMAND) {
    switch (commandName) {
      case 'ping': {
        return reply('Pong')
      }
      case 'status': {
        if (message.data.options) {
          const icao = message.data.options[0].value
          try {
            const res = await getAirport(icao.toUpperCase())
            return reply(res)
          } catch (e) {
            return reply(e.message)
          }
        }
      }
      case 'watch': {
        if (message.data.options) {
          const icao = message.data.options[0].value
          try {
            const res = await getAirport(icao.toUpperCase())
            return reply(res)
          } catch (e) {
            return reply(e.message)
          }
        }
      }
      case 'unwatch': {
        if (message.data.options) {
          const icao = message.data.options[0].value
          try {
            const res = await getAirport(icao.toUpperCase())
            return reply(res)
          } catch (e) {
            return reply(e.message)
          }
        }
      }
      case 'unsubscribe': {
        if (message.data.options) {
          const icao = message.data.options[0].value
          try {
            const res = await getAirport(icao.toUpperCase())
            return reply(res)
          } catch (e) {
            return reply(e.message)
          }
        }
      }
    }
  }
  return res.sendStatus(200)
})