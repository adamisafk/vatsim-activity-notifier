import { data } from "@serverless/cloud";

export const listAirports = async (userId) => {
    let response = `<@${userId}> is not watching any airports.`
    let watched = []

    let results = await data.get('airports:*')
    for (const item of results.items) {
        for (let i = 0; i < item.value.length; i++) {
            if(item.value[i] === userId) {
                watched.push(item.key.split(":").pop())
            }
        }
    }
    
    if(watched.length > 0) {
        response = `<@${userId}> is currently watching: ${watched}`
    }
    
    return response
}