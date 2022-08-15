import { data } from "@serverless/cloud";

export const addAirport = async (userId, icao) => {
    let response = `Began watching ${icao} for <@${userId}>. I will DM to notify you if it comes online.`

    // Get object value from ICAO key
    let results = await data.get(`airports:${icao}`);
    if (results == null) {
        // if ICAO doesn't exist, add it (with user)
        await data.set(`airports:${icao}`, [userId])
    } else {
        // otherwise check if user isn't already there in array for ICAO and add them
        if(results.indexOf(userId) === -1) {
            results.push(userId);
            // Update value
            await data.set(`airports:${icao}`, results);
        } else {
            response = `<@${userId}> is already watching ${icao}. Execute /unwatch if you wish to no longer receive notifications, or /unsubscribe to unwatch everything.`
        }
    }
    
    return response
}