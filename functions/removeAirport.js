import { data } from "@serverless/cloud";

export const removeAirport = async (userId, icao) => {
    let response = `Stopped watching ${icao} for <@${userId}>. I will no longer notify you about this airport coming online.`
    
    let results = await data.get(`airports:${icao}`)
    if (results.find(id => id === userId)) {
        if(results.length === 1) {
            // if user is the only item, remove entire key
            await data.remove(`airports:${icao}`)
        } else {
            // otherwise remove user from response array and set it
            const index = results.indexOf(userId);
            results.splice(index, 1)
            await data.set(`airports:${icao}`, results)
        }
    } else {
        response = `<@${userId}> was not watching ${icao} anyway.`
    }
    
    return response
}