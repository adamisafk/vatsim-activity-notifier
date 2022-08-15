import { api, params, schedule } from '@serverless/cloud'
import { InteractionResponseType, InteractionType, verifyKeyMiddleware } from 'discord-interactions'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

import { getAirport } from './functions/getAirport'
import { addAirport } from './functions/addAirport'
import { removeAirport } from './functions/removeAirport'
import { removeUser } from './functions/removeUser'
import { listAirports } from './functions/listAirports'
import { taskCheckAirports } from './functions/taskCheckAirports'

const commonOptions = [
  {
    name: 'airport',
    description: 'ICAO of an airport.',
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
    description: 'Ping for testing.'
  },
  {
    name: 'status',
    description: 'Get current status of an airport.',
    options: commonOptions
  },
  {
    name: 'watch',
    description: 'Begin watching an airport. Recieve a notification when it becomes online.',
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
  },
  {
    name: 'list',
    description: 'Lists all airports the user is currently watching.',
  },
  {
    name: 'test',
    description: 'test',
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

const getUser = async (userId) => {
  try {
    const user = await rest.get(Routes.user(req.params.userId))
    return res.send(user)
  } catch (e) {
    console.error(e)
    return res.sendStatus(500)
  }
}

api.post('/notify', async (req, res) => {
  try {
    await rest.post(Routes.channelMessages('1008704715787346002'), {})
    return res.send()
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
  const userId = message.member.user.id

  const reply = sendResponse(res)

  if (message.type === InteractionType.APPLICATION_COMMAND) {
    // Validate ICAO
    // ICAO param must always be first option in slash
    if (message.data.options) {
      if (/^[A-Z]{4}$/.test(message.data.options[0].value.toUpperCase()) === false) {
        return reply('ICAO is invalid.')
      }
    }


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
            const res = await addAirport(userId, icao.toUpperCase())
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
            const res = await removeAirport(userId, icao.toUpperCase())
            return reply(res)
          } catch (e) {
            return reply(e.message)
          }
        }
      }
      case 'unsubscribe': {
        try {
          const res = await removeUser(userId)
          return reply(res)
        } catch (e) {
          return reply(e.message)
        }
      }
      case 'list': {
        try {
          const res = await listAirports(userId)
          return reply(res)
        } catch (e) {
          return reply(e.message)
        }
      }
      case 'test': {
        const res = await taskCheckAirports()
        return reply(res)
      }
    }
  }
  return res.sendStatus(200)
})

// schedule.every("1 minutes", () => {
//   taskCheckAirports().then((usersToNotify) => {
    
//   })
// });