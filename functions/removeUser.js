import { data } from "@serverless/cloud";

export const removeUser = async (userId) => {
    let response = `Removed all watchlists for <@${userId}>. You will no longer receive any notifications at all and your discord tag has been purged.`
    
    let results = await data.get('airports:*')
    for (const item of results.items) {
        for (let i = 0; i < item.value.length; i++) {
            if(item.value[i] === userId) {
                item.value.splice(i, 1)
            }
        }
        if(item.value.length === 0) {
            // if value array is now empty, remove key entirely
            await data.remove(item.key)
        } else {
           await data.set(item.key, item.value) 
        }
    }

    return response
}