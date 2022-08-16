import { InteractionResponseType, InteractionType, verifyKeyMiddleware } from 'discord-interactions'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

export const taskNotifyUsers = async (usersToNotify) => {
    const keys = Object.keys(usersToNotify)
    keys.forEach((key, index) => {
        console.log(`${key}: ${usersToNotify[key]}`)
        // DM user
        
    })
}